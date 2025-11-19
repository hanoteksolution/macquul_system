from django.db import models
from django.core.validators import RegexValidator


class SiteSettings(models.Model):
    """
    Site-wide settings model - Singleton pattern
    Only one instance should exist
    """
    # Basic Information
    site_name = models.CharField(max_length=100, default='CIGAN E-Store')
    site_description = models.TextField(default='Your premier destination for electronics and stationery')
    logo = models.ImageField(upload_to='settings/logos/', blank=True, null=True)
    favicon = models.ImageField(upload_to='settings/favicons/', blank=True, null=True)
    
    # Contact Information
    contact_email = models.EmailField(default='support@estore.com')
    contact_phone = models.CharField(max_length=20, default='+000 000 0000')
    address = models.TextField(default='123 Business Street, City, Country')
    
    # Header Settings
    header_email = models.EmailField(default='support@estore.com', help_text='Email displayed in header')
    header_phone = models.CharField(max_length=20, default='+000 000 0000', help_text='Phone displayed in header')
    follow_us_text = models.CharField(max_length=50, default='Follow us', help_text='Text for social media links')
    
    # Footer Settings
    footer_description = models.TextField(
        default='Your premier online store for Electronics & Stationery. Quality products, fast delivery, and excellent customer service.',
        help_text='Description displayed in footer'
    )
    footer_address = models.TextField(default='Online Market, Your City', help_text='Address displayed in footer')
    footer_email = models.EmailField(default='support@estore.com', help_text='Email displayed in footer')
    footer_phone = models.CharField(max_length=20, default='+000 000 0000', help_text='Phone displayed in footer')
    
    # Social Media Links
    twitter_url = models.URLField(blank=True, null=True, help_text='Twitter profile URL')
    instagram_url = models.URLField(blank=True, null=True, help_text='Instagram profile URL')
    facebook_url = models.URLField(blank=True, null=True, help_text='Facebook profile URL')
    tiktok_url = models.URLField(blank=True, null=True, help_text='TikTok profile URL')
    
    # Payment Methods
    accept_visa = models.BooleanField(default=True, help_text='Accept Visa payments')
    accept_mastercard = models.BooleanField(default=True, help_text='Accept MasterCard payments')
    accept_paypal = models.BooleanField(default=True, help_text='Accept PayPal payments')
    
    # Legal Information
    copyright_text = models.CharField(max_length=200, default='E-Store. All rights reserved.', help_text='Copyright text')
    terms_url = models.URLField(blank=True, null=True, help_text='Terms of service URL')
    privacy_url = models.URLField(blank=True, null=True, help_text='Privacy policy URL')
    
    # Appearance Settings
    primary_color = models.CharField(
        max_length=7, 
        default='#3B82F6',
        validators=[RegexValidator(r'^#[0-9A-Fa-f]{6}$', 'Enter a valid hex color code')]
    )
    secondary_color = models.CharField(
        max_length=7, 
        default='#8B5CF6',
        validators=[RegexValidator(r'^#[0-9A-Fa-f]{6}$', 'Enter a valid hex color code')]
    )
    accent_color = models.CharField(
        max_length=7, 
        default='#F59E0B',
        validators=[RegexValidator(r'^#[0-9A-Fa-f]{6}$', 'Enter a valid hex color code')]
    )
    
    # Business Settings
    CURRENCY_CHOICES = [
        ('USD', 'US Dollar'),
        ('EUR', 'Euro'),
        ('GBP', 'British Pound'),
    ]
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='USD')
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=5.99)
    free_shipping_threshold = models.DecimalField(max_digits=10, decimal_places=2, default=50.00)
    
    # Feature Toggles
    enable_registration = models.BooleanField(default=True)
    enable_guest_checkout = models.BooleanField(default=True)
    enable_reviews = models.BooleanField(default=True)
    enable_wishlist = models.BooleanField(default=True)
    maintenance_mode = models.BooleanField(default=False)
    
    # Notification Settings
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    order_notifications = models.BooleanField(default=True)
    stock_alerts = models.BooleanField(default=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'
    
    def __str__(self):
        return f"Site Settings - {self.site_name}"
    
    def save(self, *args, **kwargs):
        # Temporarily disable singleton check for debugging
        # if not self.pk and SiteSettings.objects.exists():
        #     raise ValueError('Only one SiteSettings instance is allowed')
        super().save(*args, **kwargs)
    
    @classmethod
    def get_settings(cls):
        """Get or create the single settings instance"""
        settings, created = cls.objects.get_or_create(pk=1)
        return settings
