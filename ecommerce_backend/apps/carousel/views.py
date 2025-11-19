from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import CarouselSlide
from .serializers import CarouselSlideSerializer

class CarouselSlideViewSet(viewsets.ModelViewSet):
    queryset = CarouselSlide.objects.all()
    serializer_class = CarouselSlideSerializer
    
    def get_permissions(self):
        if self.action in ['active']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get only active carousel slides for public display"""
        slides = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(slides, many=True)
        return Response(serializer.data)
