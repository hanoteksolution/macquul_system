from rest_framework import serializers
from .models import SiteSettings


class SiteSettingsSerializer(serializers.ModelSerializer):
    # Make logo and favicon optional for API updates
    logo = serializers.ImageField(required=False, allow_null=True)
    favicon = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = SiteSettings
        fields = [
            'id',
            'site_name',
            'site_description',
            'logo',
            'favicon',
            'contact_email',
            'contact_phone',
            'address',
            # Header settings
            'header_email',
            'header_phone',
            'follow_us_text',
            # Footer settings
            'footer_description',
            'footer_address',
            'footer_email',
            'footer_phone',
            # Social media
            'twitter_url',
            'instagram_url',
            'facebook_url',
            'tiktok_url',
            # Payment methods
            'accept_visa',
            'accept_mastercard',
            'accept_paypal',
            # Legal
            'copyright_text',
            'terms_url',
            'privacy_url',
            # Appearance
            'primary_color',
            'secondary_color',
            'accent_color',
            # Business
            'currency',
            'tax_rate',
            'shipping_fee',
            'free_shipping_threshold',
            # Features
            'enable_registration',
            'enable_guest_checkout',
            'enable_reviews',
            'enable_wishlist',
            'maintenance_mode',
            # Notifications
            'email_notifications',
            'sms_notifications',
            'order_notifications',
            'stock_alerts',
            # Metadata
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def to_representation(self, instance):
        """Return data in snake_case format for frontend compatibility"""
        data = super().to_representation(instance)
        return data
    
    def to_internal_value(self, data):
        """Convert camelCase field names back to snake_case and handle empty image fields"""
        snake_case_data = {}
        
        for key, value in data.items():
            # Convert camelCase to snake_case
            snake_key = ''.join(['_' + c.lower() if c.isupper() else c for c in key]).lstrip('_')
            
            # Handle empty strings for image fields
            if snake_key in ['logo', 'favicon'] and value == '':
                # Skip empty image fields to avoid validation errors
                continue
                
            snake_case_data[snake_key] = value
        
        return super().to_internal_value(snake_case_data)
