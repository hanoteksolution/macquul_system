from django.contrib import admin
from .models import SiteSettings


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ['site_name', 'contact_email', 'currency', 'updated_at']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('site_name', 'site_description', 'logo', 'favicon')
        }),
        ('Header Settings', {
            'fields': ('header_email', 'header_phone', 'follow_us_text'),
            'description': 'Settings for the top header bar'
        }),
        ('Footer Settings', {
            'fields': ('footer_description', 'footer_address', 'footer_email', 'footer_phone'),
            'description': 'Settings for the footer section'
        }),
        ('Social Media Links', {
            'fields': ('twitter_url', 'instagram_url', 'facebook_url'),
            'description': 'Social media profile URLs'
        }),
        ('Payment Methods', {
            'fields': ('accept_visa', 'accept_mastercard', 'accept_paypal'),
            'description': 'Payment methods to display in footer'
        }),
        ('Legal Information', {
            'fields': ('copyright_text', 'terms_url', 'privacy_url'),
            'description': 'Legal text and links for footer'
        }),
        ('Contact Information', {
            'fields': ('contact_email', 'contact_phone', 'address')
        }),
        ('Appearance', {
            'fields': ('primary_color', 'secondary_color', 'accent_color')
        }),
        ('Business Settings', {
            'fields': ('currency', 'tax_rate', 'shipping_fee', 'free_shipping_threshold')
        }),
        ('Features', {
            'fields': ('enable_registration', 'enable_guest_checkout', 'enable_reviews', 'enable_wishlist', 'maintenance_mode')
        }),
        ('Notifications', {
            'fields': ('email_notifications', 'sms_notifications', 'order_notifications', 'stock_alerts')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        # Only allow one instance
        return not SiteSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Don't allow deletion of settings
        return False
