"""
URL configuration for ecommerce_backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from apps.users.views import UserProfileView
from apps.products.views import category_list

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.urls')),
    path('api/products/', include('apps.products.urls')),
    path('api/orders/', include('apps.orders.urls')),
    path('api/stock/', include('apps.stock.urls')),
    path('api/pos/', include('apps.pos.urls')),
    path('api/carousel/', include('apps.carousel.urls')),
    path('api/inventory/', include('apps.inventory.urls')),
    path('api/settings/', include('apps.settings.urls')),
    path('api/permissions/', include('apps.permissions.urls')),
    # Direct endpoints as specified
    path('api/users/profile', UserProfileView.as_view(), name='user-profile-direct'),
    path('api/categories/', category_list, name='category-list-direct'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
