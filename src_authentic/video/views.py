from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from api.models import Video
from .serializers import VideoSerializer



# CREATE - Upload a new video
@api_view(['POST'])
def create_video(request):
    if request.method == 'POST':
        serializer = VideoSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# READ - Get all videos
@api_view(['GET'])
def list_videos(request):
    videos = Video.objects.all()
    serializer = VideoSerializer(videos, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)

# READ - Get a single video by ID
@api_view(['GET'])
def get_video(request, pk):
    video = get_object_or_404(Video, pk=pk)
    serializer = VideoSerializer(video, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)

# UPDATE - Update video details
@api_view(['PUT', 'PATCH'])
def update_video(request, pk):
    video = get_object_or_404(Video, pk=pk)
    partial = request.method == 'PATCH'
    serializer = VideoSerializer(video, data=request.data, partial=partial, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_ok)

# DELETE - Delete a video by ID
@api_view(['DELETE'])
def delete_video(request, pk):
    video = get_object_or_404(Video, pk=pk)
    video.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

