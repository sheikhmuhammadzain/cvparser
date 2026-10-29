from django.urls import path
from .api_views import (
    CVListAPIView,
    CVDetailAPIView,
    CVUploadAPIView,
    CVFilterAPIView,
    CVStatsAPIView,
)

urlpatterns = [
    path('cvs/', CVListAPIView.as_view(), name='api_cv_list'),
    path('cvs/upload/', CVUploadAPIView.as_view(), name='api_cv_upload'),
    path('cvs/filter/', CVFilterAPIView.as_view(), name='api_cv_filter'),
    path('cvs/stats/', CVStatsAPIView.as_view(), name='api_cv_stats'),
    path('cvs/<int:pk>/', CVDetailAPIView.as_view(), name='api_cv_detail'),
]
