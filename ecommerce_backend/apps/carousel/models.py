from django.db import models

class CarouselSlide(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.TextField(blank=True)
    cta_text = models.CharField(max_length=100, default='Shop Now')
    cta_link = models.CharField(max_length=200, default='#products')
    image = models.ImageField(upload_to='carousel/', blank=True, null=True)
    background_color = models.CharField(max_length=7, default='#10b981')  # Default green
    text_color = models.CharField(max_length=7, default='#ffffff')  # Default white
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Carousel Slide'
        verbose_name_plural = 'Carousel Slides'

    def __str__(self):
        return self.title

    @property
    def image_url(self):
        if self.image:
            from django.conf import settings
            return f"{settings.MEDIA_URL}{self.image}"
        return None
