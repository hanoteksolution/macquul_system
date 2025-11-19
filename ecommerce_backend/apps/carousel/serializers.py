from rest_framework import serializers
from .models import CarouselSlide

class CarouselSlideSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = CarouselSlide
        fields = ['id', 'title', 'subtitle', 'cta_text', 'cta_link', 'image', 'image_url', 
                 'background_color', 'text_color', 'order', 'is_active']

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None
