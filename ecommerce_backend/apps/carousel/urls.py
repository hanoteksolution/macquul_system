from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarouselSlideViewSet

router = DefaultRouter()
router.register(r'slides', CarouselSlideViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
