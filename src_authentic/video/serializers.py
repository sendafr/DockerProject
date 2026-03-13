from video.models import Video
from rest_framework import serializers
from api.serializers import UserSerializer



class VideoSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    file_url = serializers.SerializerMethodField()
    file_size = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = [
            'id',
            'title',
            'description',
            'file',
            'file_url',
            'file_size',
            'uploaded_by',
            'uploaded_at',
        ]
        read_only_fields = ['id', 'uploaded_by', 'uploaded_at', 'file_url', 'file_size']

    def get_file_url(self, obj):
        """Return the full URL for the video file.

        Previously this returned a URL rooted at the frontend server
        (`http://localhost:5173`) because the Vite dev server proxies
        `/media` to Django.  That worked for network requests but meant
        that clicking a link or navigating directly to the media path
        caused the React router to treat it as an application route and
        emit ``No routes matched location ...``.  Instead we now let
        Django build an absolute URI which points directly at the
        backend.  The frontend can still fetch it cross‑origin and the
        router will remain unaffected.
        """
        if obj.file:
            request = self.context.get('request')
            if request:
                # Use the request object so the URL matches the backend host/port
                return request.build_absolute_uri(obj.file.url)
            # fallback if request not available
            return obj.file.url
        return None

    def create(self, validated_data):
        # ensure the uploader is set either from validated_data or the request
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user and 'uploaded_by' not in validated_data:
            validated_data['uploaded_by'] = request.user
        # delegate to default implementation which handles object creation
        return super().create(validated_data)

    def get_file_size(self, obj):
        """Return file size in MB"""
        if obj.file:
            return round(obj.file.size / (1024 * 1024), 2)
        return None




"""class VideoSerializer(serializers.ModelSerializer):
    video_file_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Video
        fields = [
            'id',
            'title',
            'description',
            'video_file',
            'video_file_url',
            'thumbnail',
            'thumbnail_url',
            
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id',  'created_at', 'updated_at']
    
    def get_video_file_url(self, obj):
        request = self.context.get('request')
        if obj.video_file and request:
            return request.build_absolute_uri(obj.video_file.url)
        return None
    
    def get_thumbnail_url(self, obj):
        request = self.context.get('request')
        if obj.thumbnail and request:
            return request.build_absolute_uri(obj.thumbnail.url)
        return None"""