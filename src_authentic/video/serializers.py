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
        """Return the full URL for the video file"""
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

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