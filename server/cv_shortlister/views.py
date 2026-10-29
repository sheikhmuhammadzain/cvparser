from django.shortcuts import render
from django.views import View
from django.views.generic import TemplateView
from django.http import HttpRequest
from django.core.paginator import Paginator
from .models import CV
from .utils import extract_text_from_file, check_experience, extract_entities
import logging
import os

class HomeView(TemplateView):
    def get(self, request: HttpRequest):
        total_cvs = CV.objects.count()
        processed_cvs = CV.objects.exclude(extracted_text__isnull=True).count()
        pending_cvs = total_cvs - processed_cvs
        completion_percentage = (processed_cvs / total_cvs * 100) if total_cvs > 0 else 0

        context = {
            'total_cvs': total_cvs,
            'processed_cvs': processed_cvs,
            'pending_cvs': pending_cvs,
            'completion_percentage': round(completion_percentage, 1),
        }
        return render(request, 'index.html', context)

class UploadCVView(View):
    def get(self, request: HttpRequest):
        return render(request, 'upload.html')

    def post(self, request: HttpRequest):
        cv_files = request.FILES.getlist('cv_files')
        upload_results = []
        allowed_types = ['.pdf', '.docx', '.txt', '.jpg', '.jpeg', '.png']
        max_size = 5 * 1024 * 1024  # 5MB

        if not cv_files:
            return render(request, 'upload.html', {'error': 'No files uploaded'})

        for cv_file in cv_files:
            ext = os.path.splitext(cv_file.name)[1].lower()
            
            if ext not in allowed_types:
                upload_results.append({
                    'name': cv_file.name,
                    'success': False,
                    'error': f'Invalid file type ({ext})'
                })
                continue
                
            if cv_file.size > max_size:
                upload_results.append({
                    'name': cv_file.name,
                    'success': False,
                    'error': f'File too large ({cv_file.size/1024/1024:.1f}MB > 5MB)'
                })
                continue

            try:
                cv = CV(file=cv_file)
                cv.save()
                
                cv.extracted_text = extract_text_from_file(cv.file.path)
                
                if cv.extracted_text:
                    cv.entities = extract_entities(cv.extracted_text)
                
                cv.save()
                
                upload_results.append({
                    'name': cv_file.name,
                    'success': True,
                    'message': 'Successfully processed'
                })
                
            except Exception as e:
                if 'cv' in locals():
                    cv.delete()
                    
                upload_results.append({
                    'name': cv_file.name,
                    'success': False,
                    'error': f"Processing failed: {str(e)}"
                })

        return render(request, 'upload.html', {
            'message': f'Processed {len([r for r in upload_results if r["success"]])} of {len(cv_files)} file(s)',
            'upload_results': upload_results
        })

class CVListView(View):
    def get(self, request: HttpRequest):
        cvs = CV.objects.all().order_by('-uploaded_at')
        paginator = Paginator(cvs, 5)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        pending_cvs = CV.objects.filter(extracted_text__isnull=True).count()

        for cv in page_obj:
            cv.status = 'Processed' if cv.extracted_text else 'Pending'

        return render(request, 'cv_list.html', {
            'page_obj': page_obj,
            'pending_cvs': pending_cvs,
        })

class FilterCVsView(View):
    def get(self, request: HttpRequest):
        education_levels = ['Intermediate', 'Bachelor', 'Master', 'PhD']
        skills_options = ['Python', 'Java', 'SQL', 'Django', 'Machine Learning', 'Project Management']
        experience_levels = [str(i) for i in range(16)]  # Kept for context, not used in HTML
        context = {
            'education_levels': education_levels,
            'skills_options': skills_options,
            'experience_levels': experience_levels,
        }
        return render(request, 'filter.html', context)

    def post(self, request: HttpRequest):
        education = request.POST.get('education', '').strip().lower()
        skills = request.POST.get('skills', '').strip()
        experience = request.POST.get('experience', '').strip()
        keywords = request.POST.get('keywords', '').strip()

        skills_list = [s.strip().lower() for s in skills.split(',') if s.strip()] if skills else []
        keywords_list = [k.strip().lower() for k in keywords.split(',') if k.strip()] if keywords else []

        if not any([education, skills, experience, keywords]):
            return render(request, 'filter.html', {'error': 'Please provide at least one filter criterion'})

        cvs = CV.objects.exclude(extracted_text__isnull=True)
        shortlisted = []

        for cv in cvs:
            text = cv.extracted_text.lower()
            entities = cv.entities or {}
            matches = {
                'education': False,
                'skills': 0,
                'experience': False,
                'keywords': 0
            }

            # Education check
            if education:
                matches['education'] = education in text or any(
                    education in edu.lower() for edu in entities.get('education', [])
                )
            else:
                matches['education'] = True

            # Skills check
            if skills_list:
                text_skills = sum(1 for skill in skills_list if skill in text)
                entity_skills = sum(1 for skill in skills_list if skill in [s.lower() for s in entities.get('skills', [])])
                matches['skills'] = max(text_skills, entity_skills)
            else:
                matches['skills'] = 1

            # Experience check
            if experience:
                try:
                    exp_years = float(experience)  # Changed from int to float
                    matches['experience'] = check_experience(cv.extracted_text, exp_years)
                except ValueError:
                    matches['experience'] = False
            else:
                matches['experience'] = True

            # Keywords check
            if keywords_list:
                matches['keywords'] = sum(1 for keyword in keywords_list if keyword in text)
            else:
                matches['keywords'] = 1

            # Include CV if all criteria match
            if (matches['education'] and matches['skills'] > 0 and 
                matches['experience'] and matches['keywords'] > 0):
                score = (2 if matches['education'] else 0) + \
                        matches['skills'] + \
                        (3 if matches['experience'] else 0) + \
                        (0.5 * matches['keywords'])
                shortlisted.append({
                    'cv': cv,
                    'score': score,
                    'matches': matches
                })

        shortlisted = sorted(shortlisted, key=lambda x: x['score'], reverse=True)
        paginator = Paginator(shortlisted, 5)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        context = {
            'page_obj': page_obj,
            'search_criteria': {
                'education': education,
                'skills': skills_list,
                'experience': experience,
                'keywords': keywords_list
            },
            'message': 'Search completed successfully' if shortlisted else 'No CVs matched the criteria'
        }
        return render(request, 'results.html', context)  
    
    