from django.db import models

from django.db import models
import json

class CV(models.Model):
    STATUS_CHOICES = [
        ('Processed', 'Processed'),
        ('Pending', 'Pending'),
        ('Failed', 'Failed'),  # Added to handle processing errors
    ]
    
    file = models.FileField(upload_to='cvs/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    extracted_text = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    entities = models.JSONField(blank=True, null=True)  # Stores extracted entities (e.g., skills, names)
    processing_time = models.FloatField(blank=True, null=True)  # Time taken to process CV (in seconds)
    top_skills = models.JSONField(blank=True, null=True)  # Stores top skills detected
    processed_at = models.DateTimeField(blank=True, null=True)  # Timestamp when processing completed

    def __str__(self):
        return f"CV uploaded on {self.uploaded_at}"

    @property
    def processing_progress(self):
        """Calculate processing progress for this CV."""
        if self.status == 'Processed':
            return 100.0
        elif self.status == 'Pending':
            return 0.0
        return None

    class Meta:
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['uploaded_at']),
        ]  # Improve query performance for status and upload time

    @staticmethod
    def get_stats():
        """Calculate aggregate statistics for CVs."""
        total_cvs = CV.objects.count()
        processed_cvs = CV.objects.filter(status='Processed').count()
        pending_cvs = CV.objects.filter(status='Pending').count()
        processing_progress = (
            (processed_cvs / total_cvs * 100) if total_cvs > 0 else 0.0
        )
        
        # Calculate average processing time for processed CVs
        processed_cvs_with_time = CV.objects.filter(
            status='Processed', processing_time__isnull=False
        )
        avg_processing_time = (
            processed_cvs_with_time.aggregate(models.Avg('processing_time'))['processing_time__avg']
            if processed_cvs_with_time.exists() else None
        )
        
        # Aggregate top skills from processed CVs
        top_skills = []
        for cv in CV.objects.filter(status='Processed', top_skills__isnull=False):
            skills = cv.top_skills or []
            top_skills.extend(skills)
        # Count frequency of skills (simplified example)
        from collections import Counter
        top_skills_counts = Counter(top_skills).most_common(5)  # Top 5 skills
        
        return {
            'total_cvs': total_cvs,
            'processed_cvs': processed_cvs,
            'pending_cvs': pending_cvs,
            'processing_progress': round(processing_progress, 1),
            'avg_processing_time': avg_processing_time,
            'top_skills': top_skills_counts,
        }
        
