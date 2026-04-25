from django.urls import path
from .views import VideoUploadView, VideoListView, VideoDetailView

app_name = 'video'

urlpatterns = [
    # List and upload videos
    path('videos/', VideoListView.as_view(), name='video-list'),
    path('videos/upload/', VideoUploadView.as_view(), name='video-upload'),
    
    # Detail, update, delete videos
    path('videos/<int:video_id>/', VideoDetailView.as_view(), name='video-detail'),
]
