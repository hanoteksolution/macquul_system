from django.contrib import admin
from .models import Announcement, NavLink, HomeSection, Testimonial, PartnerBrand


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('text', 'position', 'order', 'is_active')
    list_filter = ('position', 'is_active')


@admin.register(NavLink)
class NavLinkAdmin(admin.ModelAdmin):
    list_display = ('label', 'href', 'location', 'order', 'is_active')


@admin.register(HomeSection)
class HomeSectionAdmin(admin.ModelAdmin):
    list_display = ('section_key', 'title', 'is_active')


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'order', 'is_active')


@admin.register(PartnerBrand)
class PartnerBrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'order', 'is_active')
