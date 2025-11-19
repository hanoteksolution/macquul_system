from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookLocationViewSet

router = DefaultRouter()
router.register(r'books', BookLocationViewSet, basename='books')

urlpatterns = [
    path('', include(router.urls)),
]
