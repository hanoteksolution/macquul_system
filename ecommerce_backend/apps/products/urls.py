from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, category_list

router = DefaultRouter()
router.register(r'', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
    path('categories/', category_list, name='category-list'),
]
