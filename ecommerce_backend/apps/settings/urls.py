from django.urls import path
from . import views

urlpatterns = [
    # API endpoints for admin
    path('', views.site_settings_api, name='site_settings_api'),
    path('get/', views.get_site_settings, name='get_site_settings'),
    path('update/', views.update_site_settings, name='update_site_settings'),
    
    # Public endpoint for client site
    path('public/', views.public_settings, name='public_settings'),
    
    # Debug endpoint
    path('debug/', views.debug_settings_update, name='debug_settings_update'),
]
