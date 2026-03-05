from video.models import Video
from rest_framework import serializers



class VideoSerializer(serializers.ModelSerializer):
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
        return None