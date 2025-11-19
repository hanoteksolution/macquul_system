from django.contrib import admin
from django.utils.html import format_html
from .models import CarouselSlide

@admin.register(CarouselSlide)
class CarouselSlideAdmin(admin.ModelAdmin):
    list_display = ['title', 'subtitle', 'cta_text', 'order', 'is_active', 'preview', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'subtitle']
    list_editable = ['order', 'is_active']
    ordering = ['order', '-created_at']
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'subtitle', 'cta_text', 'cta_link', 'image')
        }),
        ('Styling', {
            'fields': ('background_color', 'text_color'),
            'description': 'Use hex color codes (e.g., #3b82f6 for blue, #ef4444 for red)'
        }),
        ('Settings', {
            'fields': ('order', 'is_active'),
            'description': 'Order determines the sequence of slides. Lower numbers appear first.'
        }),
    )
    
    def preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 100px; max-height: 50px; border-radius: 4px;" />',
                obj.image.url
            )
        return format_html(
            '<div style="width: 100px; height: 50px; background-color: {}; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: {}; font-size: 10px;">Preview</div>',
            obj.background_color or '#3b82f6',
            obj.text_color or '#ffffff'
        )
    preview.short_description = 'Preview'
    
    def get_queryset(self, request):
        return super().get_queryset(request).order_by('order', '-created_at')
