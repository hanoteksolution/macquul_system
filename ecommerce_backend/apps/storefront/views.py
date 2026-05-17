from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from apps.settings.models import SiteSettings
from .models import Announcement, NavLink, HomeSection, Testimonial, PartnerBrand
from .serializers import (
    AnnouncementSerializer,
    NavLinkSerializer,
    HomeSectionSerializer,
    TestimonialSerializer,
    PartnerBrandSerializer,
)


class AdminWriteMixin:
    """Authenticated staff can manage; public reads via /public/."""

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]


class AnnouncementViewSet(AdminWriteMixin, viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer


class NavLinkViewSet(AdminWriteMixin, viewsets.ModelViewSet):
    queryset = NavLink.objects.all()
    serializer_class = NavLinkSerializer


class HomeSectionViewSet(AdminWriteMixin, viewsets.ModelViewSet):
    queryset = HomeSection.objects.all()
    serializer_class = HomeSectionSerializer
    lookup_field = 'section_key'
    lookup_value_regex = '[^/]+'


class TestimonialViewSet(AdminWriteMixin, viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer


class PartnerBrandViewSet(AdminWriteMixin, viewsets.ModelViewSet):
    queryset = PartnerBrand.objects.all()
    serializer_class = PartnerBrandSerializer


def _site_header(request):
    settings = SiteSettings.get_settings()
    logo_url = None
    if settings.logo:
        logo_url = request.build_absolute_uri(settings.logo.url) if request else settings.logo.url
    return {
        'site_name': settings.site_name,
        'site_description': settings.site_description,
        'logo_url': logo_url,
        'currency': settings.currency,
        'default_locale': getattr(settings, 'default_locale', 'EN'),
        'search_placeholder': getattr(settings, 'search_placeholder', 'Search products, brands...'),
        'free_shipping_threshold': float(settings.free_shipping_threshold),
        'promo_code': getattr(settings, 'promo_code', ''),
        'member_discount_percent': getattr(settings, 'member_discount_percent', 15),
        'primary_color': settings.primary_color,
        'secondary_color': settings.secondary_color,
    }


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def public_storefront(request):
    """Bundled storefront content for the client site."""
    announcements = Announcement.objects.filter(is_active=True)
    primary = announcements.filter(position='primary').first()
    promos = announcements.filter(position='promo')

    sections_qs = HomeSection.objects.filter(is_active=True)
    sections = {s.section_key: HomeSectionSerializer(s).data for s in sections_qs}

    return Response({
        'header': _site_header(request),
        'announcement_primary': AnnouncementSerializer(primary).data if primary else None,
        'announcements': AnnouncementSerializer(promos, many=True).data,
        'nav_links': NavLinkSerializer(
            NavLink.objects.filter(is_active=True, location__in=['header', 'both']),
            many=True,
        ).data,
        'footer_links': NavLinkSerializer(
            NavLink.objects.filter(is_active=True, location__in=['footer', 'both']),
            many=True,
        ).data,
        'sections': sections,
        'testimonials': TestimonialSerializer(
            Testimonial.objects.filter(is_active=True),
            many=True,
            context={'request': request},
        ).data,
        'brands': PartnerBrandSerializer(
            PartnerBrand.objects.filter(is_active=True),
            many=True,
            context={'request': request},
        ).data,
    }, status=status.HTTP_200_OK)
