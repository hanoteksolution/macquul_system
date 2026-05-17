from rest_framework import serializers
from apps.settings.models import SiteSettings
from .models import Announcement, NavLink, HomeSection, Testimonial, PartnerBrand


def _abs_url(request, file_field):
    if file_field and request:
        return request.build_absolute_uri(file_field.url)
    if file_field:
        return file_field.url
    return None


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = [
            'id', 'position', 'badge_text', 'text', 'icon', 'link',
            'order', 'is_active', 'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class NavLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = NavLink
        fields = [
            'id', 'label', 'href', 'location', 'order',
            'is_active', 'open_in_new_tab', 'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class HomeSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeSection
        fields = [
            'id', 'section_key', 'title', 'subtitle', 'badge_text',
            'view_all_href', 'is_active', 'config', 'updated_at',
        ]
        read_only_fields = ['updated_at']


class TestimonialSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = Testimonial
        fields = [
            'id', 'name', 'role', 'text', 'rating', 'avatar', 'avatar_url',
            'order', 'is_active', 'created_at',
        ]
        read_only_fields = ['created_at', 'avatar_url']

    def get_avatar_url(self, obj):
        request = self.context.get('request')
        return _abs_url(request, obj.avatar)


class PartnerBrandSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = PartnerBrand
        fields = ['id', 'name', 'logo', 'logo_url', 'link', 'order', 'is_active']
        read_only_fields = ['logo_url']

    def get_logo_url(self, obj):
        request = self.context.get('request')
        return _abs_url(request, obj.logo)
