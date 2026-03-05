from django.urls import path
from video.views import views
# List all videos
path('list_videos/', views.list_videos, name='list_videos'),

# Video upload endpoint
path('create_video/', views.create_video, name='create_video'),
    
# Get a specific video by ID
path('<int:pk>/', views.get_video, name='get_video'),
    
# Update a specific video by ID
path('videos/<int:pk>/', views.update_video, name='update_video'),
    
# Delete a specific video by ID (optional)
path('videos/<int:pk>/', views.delete_video, name='delete_video'),

   