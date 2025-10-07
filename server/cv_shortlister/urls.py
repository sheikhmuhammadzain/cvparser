from django.urls import path
from .views import HomeView, UploadCVView, FilterCVsView, CVListView

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('upload/', UploadCVView.as_view(), name='upload_cv'),
    path('filter/', FilterCVsView.as_view(), name='filter_cvs'),
    path('cv-list/', CVListView.as_view(), name='cv_list'),
]