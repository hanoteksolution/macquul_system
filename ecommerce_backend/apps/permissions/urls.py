from django.urls import path
from . import views

urlpatterns = [
    # Permission management
    path('permissions/', views.permission_list_view, name='permission_list'),
    
    # Role management
    path('roles/', views.role_list_view, name='role_list'),
    path('roles/<int:role_id>/', views.role_detail_view, name='role_detail'),
    
    # User permission management
    path('user-permissions/', views.user_permission_list_view, name='user_permission_list'),
    path('user-permissions/<int:user_id>/', views.user_permission_detail_view, name='user_permission_detail'),
    
    # Current user permissions
    path('my-permissions/', views.my_permissions_view, name='my_permissions'),
    path('check-permission/', views.check_permission_view, name='check_permission'),
]
