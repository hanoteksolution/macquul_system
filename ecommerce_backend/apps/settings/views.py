from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from django.http import JsonResponse
from .models import SiteSettings
from .serializers import SiteSettingsSerializer


@api_view(['GET'])
@permission_classes([AllowAny])  # Allow public access to read settings
def get_site_settings(request):
    """
    Get current site settings
    Public endpoint - no authentication required
    """
    try:
        settings = SiteSettings.get_settings()
        serializer = SiteSettingsSerializer(settings)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': f'Failed to retrieve settings: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated, IsAdminUser])  # Only admin users can update settings
def update_site_settings(request):
    """
    Update site settings
    Requires admin authentication
    """
    try:
        print(f"Update request data: {request.data}")  # Debug log
        
        # Try to get existing settings or create new one
        try:
            settings = SiteSettings.objects.get(pk=1)
        except SiteSettings.DoesNotExist:
            settings = SiteSettings.objects.create(pk=1)
        
        serializer = SiteSettingsSerializer(settings, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Settings updated successfully',
                'settings': serializer.data
            }, status=status.HTTP_200_OK)
        else:
            print(f"Serializer errors: {serializer.errors}")  # Debug log
            return Response({
                'error': 'Invalid data',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        print(f"Exception in update_site_settings: {str(e)}")  # Debug log
        import traceback
        traceback.print_exc()
        return Response(
            {'error': f'Failed to update settings: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET', 'POST', 'PUT', 'PATCH'])
@permission_classes([AllowAny])  # Allow all for GET, check auth in view
def site_settings_api(request):
    """
    Combined API endpoint for settings
    GET: Retrieve settings (public)
    POST/PUT/PATCH: Update settings (admin only)
    """
    if request.method == 'GET':
        try:
            settings = SiteSettings.get_settings()
            serializer = SiteSettingsSerializer(settings)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': f'Failed to retrieve settings: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    else:
        # Check if user is admin for update operations
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required. Please log in to the admin panel.'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        if not request.user.is_staff:
            return Response(
                {'error': 'Admin privileges required. User must be staff.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return update_site_settings(request)


# Working settings update endpoint
@api_view(['POST'])
@permission_classes([AllowAny])  # Temporarily remove auth for testing
def debug_settings_update(request):
    """Working settings update endpoint"""
    try:
        print(f"🔍 Settings update called")
        print(f"Request data: {request.data}")
        
        # Get or create settings instance
        try:
            settings = SiteSettings.objects.get(pk=1)
            print(f"✅ Found existing settings: {settings}")
        except SiteSettings.DoesNotExist:
            print(f"📝 Creating new settings instance")
            settings = SiteSettings()
            settings.pk = 1
        
        # Update fields manually (bypassing serializer for now)
        data = request.data
        
        # Basic info
        if 'siteName' in data:
            settings.site_name = data['siteName']
        if 'siteDescription' in data:
            settings.site_description = data['siteDescription']
        if 'contactEmail' in data:
            settings.contact_email = data['contactEmail']
        if 'contactPhone' in data:
            settings.contact_phone = data['contactPhone']
        if 'address' in data:
            settings.address = data['address']
            
        # Colors
        if 'primaryColor' in data:
            settings.primary_color = data['primaryColor']
        if 'secondaryColor' in data:
            settings.secondary_color = data['secondaryColor']
        if 'accentColor' in data:
            settings.accent_color = data['accentColor']
            
        # Business settings
        if 'currency' in data:
            settings.currency = data['currency']
        if 'taxRate' in data:
            settings.tax_rate = data['taxRate']
        if 'shippingFee' in data:
            settings.shipping_fee = data['shippingFee']
        if 'freeShippingThreshold' in data:
            settings.free_shipping_threshold = data['freeShippingThreshold']
            
        # Feature toggles
        if 'enableRegistration' in data:
            settings.enable_registration = data['enableRegistration']
        if 'enableGuestCheckout' in data:
            settings.enable_guest_checkout = data['enableGuestCheckout']
        if 'enableReviews' in data:
            settings.enable_reviews = data['enableReviews']
        if 'enableWishlist' in data:
            settings.enable_wishlist = data['enableWishlist']
        if 'maintenanceMode' in data:
            settings.maintenance_mode = data['maintenanceMode']
            
        # Notifications
        if 'emailNotifications' in data:
            settings.email_notifications = data['emailNotifications']
        if 'smsNotifications' in data:
            settings.sms_notifications = data['smsNotifications']
        if 'orderNotifications' in data:
            settings.order_notifications = data['orderNotifications']
        if 'stockAlerts' in data:
            settings.stock_alerts = data['stockAlerts']
        
        # Save to database
        print(f"💾 Saving settings to database...")
        settings.save()
        print(f"✅ Settings saved successfully!")
        
        # Return success response
        return Response({
            'message': 'Settings updated successfully!',
            'settings': {
                'siteName': settings.site_name,
                'siteDescription': settings.site_description,
                'contactEmail': settings.contact_email,
                'contactPhone': settings.contact_phone,
                'address': settings.address,
                'primaryColor': settings.primary_color,
                'secondaryColor': settings.secondary_color,
                'accentColor': settings.accent_color,
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"❌ Settings update error: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({
            'error': f'Failed to update settings: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Public endpoint for client site (no authentication required)
@api_view(['GET'])
@permission_classes([AllowAny])
def public_settings(request):
    """
    Public settings endpoint for client site
    Returns only public-safe settings
    """
    try:
        settings = SiteSettings.get_settings()
        
        # Only return public-safe settings
        public_data = {
            'siteName': settings.site_name,
            'siteDescription': settings.site_description,
            'contactEmail': settings.contact_email,
            'contactPhone': settings.contact_phone,
            'address': settings.address,
            'primaryColor': settings.primary_color,
            'secondaryColor': settings.secondary_color,
            'accentColor': settings.accent_color,
            'currency': settings.currency,
            'enableRegistration': settings.enable_registration,
            'enableGuestCheckout': settings.enable_guest_checkout,
            'enableReviews': settings.enable_reviews,
            'enableWishlist': settings.enable_wishlist,
            'maintenanceMode': settings.maintenance_mode,
        }
        
        return Response(public_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to retrieve settings: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

