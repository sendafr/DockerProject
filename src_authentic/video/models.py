from django.db import models
from django.core.validators import FileExtensionValidator
from django.utils import timezone


# Create your models here.

class Video(models.Model):
    VIDEO_STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    video_file = models.FileField(
        upload_to='videos/%Y/%m/%d/',
        validators=[FileExtensionValidator(allowed_extensions=['mp4', 'avi', 'mov', 'mkv', 'flv', 'wmv'])]
    )
    thumbnail = models.ImageField(upload_to='thumbnails/%Y/%m/%d/', blank=True, null=True)
    duration = models.IntegerField(help_text="Duration in seconds", blank=True, null=True)
    status = models.CharField(max_length=20, choices=VIDEO_STATUS_CHOICES, default='draft')
    views_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Videos"
    
    def __str__(self):
        return self.title

