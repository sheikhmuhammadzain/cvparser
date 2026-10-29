from typing import List, Dict, Any
import os
import time
from django.utils import timezone
from django.db.models import QuerySet
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import CV
from .serializers import CVSerializer, CVDetailSerializer
from .utils import extract_text_from_file, check_experience, extract_entities


ALLOWED_TYPES = ['.pdf', '.docx', '.txt', '.jpg', '.jpeg', '.png']
MAX_SIZE = 5 * 1024 * 1024  # 5MB


class CVListAPIView(generics.ListAPIView):
    queryset: QuerySet = CV.objects.all().order_by('-uploaded_at')
    serializer_class = CVSerializer


class CVDetailAPIView(generics.RetrieveAPIView):
    queryset: QuerySet = CV.objects.all()
    serializer_class = CVDetailSerializer


class CVUploadAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        files = request.FILES.getlist('files') or request.FILES.getlist('cv_files')
        if not files:
            return Response({
                'detail': 'No files provided. Use form field name "files" (or "cv_files").'
            }, status=status.HTTP_400_BAD_REQUEST)

        results: List[Dict[str, Any]] = []
        for f in files:
            ext = os.path.splitext(f.name)[1].lower()
            if ext not in ALLOWED_TYPES:
                results.append({'name': f.name, 'success': False, 'error': f'Invalid file type ({ext})'})
                continue
            if f.size > MAX_SIZE:
                results.append({'name': f.name, 'success': False, 'error': f'File too large ({f.size/1024/1024:.1f}MB > 5MB)'})
                continue

            cv = None
            start = time.perf_counter()
            try:
                cv = CV.objects.create(file=f, status='Pending')
                text = extract_text_from_file(cv.file.path)
                if text:
                    cv.extracted_text = text
                    cv.entities = extract_entities(text) or {}
                    # Persist top_skills for stats (fallback to empty list)
                    try:
                        raw_skills = (cv.entities or {}).get('skills', []) or []
                        if isinstance(raw_skills, list):
                            # normalize and dedupe
                            skills_norm = []
                            seen = set()
                            for s in raw_skills:
                                if not isinstance(s, str):
                                    continue
                                val = s.strip().lower()
                                if val and val not in seen:
                                    seen.add(val)
                                    skills_norm.append(val)
                            cv.top_skills = skills_norm
                        else:
                            cv.top_skills = []
                    except Exception:
                        cv.top_skills = []
                    cv.status = 'Processed'
                else:
                    cv.status = 'Failed'
                cv.processed_at = timezone.now()
                cv.processing_time = round(time.perf_counter() - start, 3)
                cv.save()

                results.append({
                    'name': f.name,
                    'success': True,
                    'cv': CVSerializer(cv, context={'request': request}).data
                })
            except Exception as e:
                if cv:
                    cv.status = 'Failed'
                    cv.save(update_fields=['status'])
                results.append({'name': f.name, 'success': False, 'error': f'Processing failed: {str(e)}'})

        return Response({
            'processed': len([r for r in results if r.get('success')]),
            'total': len(files),
            'results': results
        }, status=status.HTTP_200_OK)


class CVFilterAPIView(APIView):
    parser_classes = (JSONParser, FormParser)

    def post(self, request, *args, **kwargs):
        education = (request.data.get('education') or '').strip().lower()
        skills = (request.data.get('skills') or '')
        experience = (request.data.get('experience') or '').strip()
        keywords = (request.data.get('keywords') or '')

        skills_list = [s.strip().lower() for s in skills.split(',') if s and s.strip()] if isinstance(skills, str) else [s.strip().lower() for s in skills]
        keywords_list = [k.strip().lower() for k in keywords.split(',') if k and k.strip()] if isinstance(keywords, str) else [k.strip().lower() for k in keywords]

        if not any([education, skills_list, experience, keywords_list]):
            return Response({'detail': 'Provide at least one criterion.'}, status=status.HTTP_400_BAD_REQUEST)

        cvs = CV.objects.exclude(extracted_text__isnull=True)
        shortlisted: List[Dict[str, Any]] = []

        for cv in cvs:
            text = (cv.extracted_text or '').lower()
            entities = cv.entities or {}
            matches = {
                'education': False,
                'skills': 0,
                'experience': False,
                'keywords': 0
            }

            if education:
                matches['education'] = education in text or any(
                    education in (edu or '').lower() for edu in entities.get('education', [])
                )
            else:
                matches['education'] = True

            if skills_list:
                text_skills = sum(1 for skill in skills_list if skill in text)
                entity_skills = sum(1 for skill in skills_list if skill in [s.lower() for s in entities.get('skills', [])])
                matches['skills'] = max(text_skills, entity_skills)
            else:
                matches['skills'] = 1

            if experience:
                try:
                    exp_years = float(experience)
                    matches['experience'] = check_experience(cv.extracted_text, exp_years)
                except ValueError:
                    matches['experience'] = False
            else:
                matches['experience'] = True

            if keywords_list:
                matches['keywords'] = sum(1 for keyword in keywords_list if keyword in text)
            else:
                matches['keywords'] = 1

            # Calculate score based on matches
            score = (2 if matches['education'] else 0) + matches['skills'] + (3 if matches['experience'] else 0) + (0.5 * matches['keywords'])
            
            # Include CV if it has ANY positive score (matches at least one criterion)
            # This allows partial matches while still ranking by relevance
            if score > 0:
                shortlisted.append({
                    'cv': CVSerializer(cv, context={'request': request}).data,
                    'score': score,
                    'matches': matches
                })

        shortlisted = sorted(shortlisted, key=lambda x: x['score'], reverse=True)
        return Response({'count': len(shortlisted), 'results': shortlisted}, status=status.HTTP_200_OK)


class CVStatsAPIView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            stats = CV.get_stats()
        except Exception:
            stats = {
                'total_cvs': CV.objects.count(),
                'processed_cvs': CV.objects.exclude(extracted_text__isnull=True).count(),
                'pending_cvs': CV.objects.filter(extracted_text__isnull=True).count(),
                'processing_progress': 0.0,
                'avg_processing_time': None,
                'top_skills': [],
            }

        # Ensure fields expected by frontend exist and are shaped correctly
        # failed_cvs
        try:
            failed_cvs = CV.objects.filter(status='Failed').count()
        except Exception:
            failed_cvs = max(0, stats.get('total_cvs', 0) - stats.get('processed_cvs', 0) - stats.get('pending_cvs', 0))

        # avg_processing_time as a number
        avg_time = stats.get('avg_processing_time')
        if avg_time is None:
            avg_time = 0.0

        # top_skills as [{skill, count}] with fallback to entities if empty
        raw_skills = stats.get('top_skills') or []
        if not raw_skills:
            # Fallback: aggregate from entities across processed CVs
            from collections import Counter
            agg: Counter = Counter()
            for cv in CV.objects.filter(status='Processed'):
                skills = []
                if cv.top_skills:
                    skills = cv.top_skills
                elif cv.entities and isinstance(cv.entities, dict):
                    skills = cv.entities.get('skills', []) or []
                # normalize
                for s in skills:
                    if isinstance(s, str) and s.strip():
                        agg[s.strip().lower()] += 1
            raw_skills = list(agg.most_common(5))

        if raw_skills and isinstance(raw_skills[0], (list, tuple)):
            top_skills = [{ 'skill': k, 'count': v } for k, v in raw_skills]
        else:
            top_skills = raw_skills

        normalized = {
            'total_cvs': stats.get('total_cvs', 0),
            'processed_cvs': stats.get('processed_cvs', 0),
            'pending_cvs': stats.get('pending_cvs', 0),
            'failed_cvs': failed_cvs,
            'processing_progress': stats.get('processing_progress', 0.0),
            'avg_processing_time': float(avg_time) if avg_time is not None else 0.0,
            'top_skills': top_skills,
        }
        return Response(normalized, status=status.HTTP_200_OK)
