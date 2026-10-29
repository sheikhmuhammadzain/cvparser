from rest_framework import serializers
from .models import CV


class CVSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = CV
        fields = [
            'id', 'file', 'file_url', 'uploaded_at', 'status',
            'processing_time', 'processed_at', 'top_skills'
        ]
        read_only_fields = [
            'id', 'uploaded_at', 'status', 'processing_time', 'processed_at', 'top_skills'
        ]

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None


class CVDetailSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = CV
        fields = [
            'id', 'file', 'file_url', 'uploaded_at', 'status', 'extracted_text',
            'entities', 'processing_time', 'processed_at', 'top_skills'
        ]
        read_only_fields = fields

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None
