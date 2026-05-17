from django.db import models


class Announcement(models.Model):
    ICON_CHOICES = [
        ('none', 'None'),
        ('truck', 'Truck'),
        ('gift', 'Gift'),
        ('headphones', 'Headphones'),
        ('sparkles', 'Sparkles'),
    ]
    POSITION_CHOICES = [
        ('primary', 'Primary (left badge + headline)'),
        ('promo', 'Promo (center bar)'),
    ]

    position = models.CharField(max_length=20, choices=POSITION_CHOICES, default='promo')
    badge_text = models.CharField(max_length=30, blank=True, help_text='e.g. NEW — only for primary')
    text = models.CharField(max_length=255)
    icon = models.CharField(max_length=20, choices=ICON_CHOICES, default='none')
    link = models.CharField(max_length=500, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Announcement'
        verbose_name_plural = 'Announcements'

    def __str__(self):
        return self.text[:60]


class NavLink(models.Model):
    LOCATION_CHOICES = [
        ('header', 'Header'),
        ('footer', 'Footer'),
        ('both', 'Header & Footer'),
    ]

    label = models.CharField(max_length=80)
    href = models.CharField(max_length=500)
    location = models.CharField(max_length=10, choices=LOCATION_CHOICES, default='header')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    open_in_new_tab = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Navigation link'
        verbose_name_plural = 'Navigation links'

    def __str__(self):
        return self.label


class HomeSection(models.Model):
    SECTION_KEYS = [
        ('featured', 'Featured products'),
        ('categories', 'Shop by category'),
        ('flash_sale', 'Flash sale'),
        ('trending', 'Trending now'),
        ('testimonials', 'Testimonials'),
        ('brands', 'Partner brands'),
        ('newsletter', 'Newsletter'),
    ]

    section_key = models.CharField(max_length=40, choices=SECTION_KEYS, unique=True)
    title = models.CharField(max_length=120)
    subtitle = models.CharField(max_length=255, blank=True)
    badge_text = models.CharField(max_length=60, blank=True)
    view_all_href = models.CharField(max_length=500, blank=True)
    is_active = models.BooleanField(default=True)
    config = models.JSONField(default=dict, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Home section'
        verbose_name_plural = 'Home sections'

    def __str__(self):
        return f'{self.get_section_key_display()}: {self.title}'


class Testimonial(models.Model):
    name = models.CharField(max_length=80)
    role = models.CharField(max_length=80, blank=True)
    text = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    avatar = models.ImageField(upload_to='storefront/testimonials/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.name

    @property
    def avatar_url(self):
        if self.avatar:
            return self.avatar.url
        return None


class PartnerBrand(models.Model):
    name = models.CharField(max_length=80)
    logo = models.ImageField(upload_to='storefront/brands/', blank=True, null=True)
    link = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.name

    @property
    def logo_url(self):
        if self.logo:
            return self.logo.url
        return None
