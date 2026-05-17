from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'announcements', views.AnnouncementViewSet, basename='announcement')
router.register(r'nav-links', views.NavLinkViewSet, basename='nav-link')
router.register(r'sections', views.HomeSectionViewSet, basename='home-section')
router.register(r'testimonials', views.TestimonialViewSet, basename='testimonial')
router.register(r'brands', views.PartnerBrandViewSet, basename='partner-brand')

urlpatterns = [
    path('public/', views.public_storefront, name='public_storefront'),
    path('', include(router.urls)),
]
