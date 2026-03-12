from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Video   # ✅ Import from video.models, not api.models
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import Video
from .serializers import VideoSerializer


class VideoUploadView(APIView):
    """Handle video uploads"""
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        """Upload a new video"""
        serializer = VideoSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            # the serializer will populate uploaded_by from request.user if
            # it's missing, so we don't need to send it explicitly here.
            serializer.save()
            return Response(
                {
                    'status': 'success',
                    'message': 'Video uploaded successfully',
                    'data': serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(
            {
                'status': 'error',
                'message': 'Upload failed',
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class VideoListView(APIView):
    """List all videos"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve all videos"""
        videos = Video.objects.all().order_by('-uploaded_at')
        serializer = VideoSerializer(
            videos,
            many=True,
            context={'request': request}
        )
        return Response(
            {
                'status': 'success',
                'count': videos.count(),
                'data': serializer.data
            },
            status=status.HTTP_200_OK
        )


class VideoDetailView(APIView):
    """Handle individual video operations"""
    permission_classes = [IsAuthenticated]

    def get(self, request, video_id):
        """Retrieve a specific video"""
        video = get_object_or_404(Video, id=video_id)
        serializer = VideoSerializer(video, context={'request': request})
        return Response(
            {
                'status': 'success',
                'data': serializer.data
            },
            status=status.HTTP_200_OK
        )

    def patch(self, request, video_id):
        """Update video metadata (title, description)"""
        video = get_object_or_404(Video, id=video_id)
        
        # Check if user is the owner
        if video.uploaded_by != request.user:
            return Response(
                {
                    'status': 'error',
                    'message': 'You do not have permission to update this video'
                },
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = VideoSerializer(
            video,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    'status': 'success',
                    'message': 'Video updated successfully',
                    'data': serializer.data
                },
                status=status.HTTP_200_OK
            )
        return Response(
            {
                'status': 'error',
                'message': 'Update failed',
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, video_id):
        """Delete a video"""
        video = get_object_or_404(Video, id=video_id)
        
        # Check if user is the owner
        if video.uploaded_by != request.user:
            return Response(
                {
                    'status': 'error',
                    'message': 'You do not have permission to delete this video'
                },
                status=status.HTTP_403_FORBIDDEN
            )

        video.delete()
        return Response(
            {
                'status': 'success',
                'message': 'Video deleted successfully'
            },
            status=status.HTTP_204_NO_CONTENT
        )


"""
class VideoUploadView(APIView):
    def post(self, request):
        return Response({
            'status': 'success',
            'message': 'Video uploaded'
        }, status=status.HTTP_201_CREATED)

class VideoListView(APIView):
    def get(self, request):
        videos = Video.objects.all().values('id', 'title', 'uploaded_at')
        return Response({'videos': list(videos)})
"""