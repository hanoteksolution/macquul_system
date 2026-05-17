from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.settings.models import SiteSettings
from apps.storefront.models import Announcement, NavLink, HomeSection, Testimonial, PartnerBrand


class Command(BaseCommand):
    help = 'Seed default storefront content (announcements, sections, testimonials, brands)'

    def handle(self, *args, **options):
        settings = SiteSettings.get_settings()
        settings.site_name = 'Macquul'
        if not getattr(settings, 'promo_code', None):
            settings.promo_code = 'WELCOME15'
        if not getattr(settings, 'default_locale', None):
            settings.default_locale = 'EN'
        if not getattr(settings, 'search_placeholder', None):
            settings.search_placeholder = 'Search products, brands...'
        if not getattr(settings, 'member_discount_percent', None):
            settings.member_discount_percent = 15
        settings.free_shipping_threshold = 75
        settings.save()

        if not Announcement.objects.exists():
            Announcement.objects.bulk_create([
                Announcement(
                    position='primary',
                    badge_text='NEW',
                    text='Spring collection — Shop now',
                    icon='sparkles',
                    link='#products',
                    order=0,
                ),
                Announcement(
                    position='promo',
                    text='Free shipping on orders over $75',
                    icon='truck',
                    order=0,
                ),
                Announcement(
                    position='promo',
                    text='New members get 15% off — code WELCOME15',
                    icon='gift',
                    order=1,
                ),
                Announcement(
                    position='promo',
                    text='24/7 premium support',
                    icon='headphones',
                    order=2,
                ),
            ])
            self.stdout.write(self.style.SUCCESS('Created announcements'))

        if not NavLink.objects.exists():
            NavLink.objects.bulk_create([
                NavLink(label='Home', href='/', location='header', order=0),
                NavLink(label='Shop', href='/shop', location='header', order=1),
            ])

        defaults = {
            'featured': ('Featured products', 'Handpicked bestsellers for you', '/shop'),
            'categories': ('Shop by category', 'Explore our curated collections', '/shop'),
            'flash_sale': ('Limited time offers', '', ''),
            'trending': ('Trending now', 'What everyone is buying this week', '/shop'),
            'testimonials': ('Loved by customers', 'Real reviews from our community', ''),
            'brands': ('', '', ''),
            'newsletter': ('Join our newsletter', 'Exclusive drops, early access, and 15% off your first order.', ''),
        }
        end_at = (timezone.now() + timedelta(hours=6)).isoformat()
        for key, (title, subtitle, href) in defaults.items():
            config = {}
            if key == 'flash_sale':
                config = {'end_at': end_at, 'badge_text': 'Flash sale'}
            HomeSection.objects.get_or_create(
                section_key=key,
                defaults={
                    'title': title,
                    'subtitle': subtitle,
                    'view_all_href': href,
                    'badge_text': config.pop('badge_text', '') if key == 'flash_sale' else '',
                    'config': config,
                    'is_active': True,
                },
            )
        # fix flash_sale badge
        fs, _ = HomeSection.objects.get_or_create(section_key='flash_sale')
        if not fs.badge_text:
            fs.badge_text = 'Flash sale'
            fs.config = fs.config or {}
            fs.config.setdefault('end_at', end_at)
            fs.save()

        if not Testimonial.objects.exists():
            Testimonial.objects.bulk_create([
                Testimonial(
                    name='Sarah M.',
                    role='Verified buyer',
                    text='The most polished shopping experience I have used. Fast delivery and premium packaging.',
                    rating=5,
                    order=0,
                ),
                Testimonial(
                    name='James K.',
                    role='Premium member',
                    text='Beautiful UI, seamless checkout, and excellent product quality every time.',
                    rating=5,
                    order=1,
                ),
                Testimonial(
                    name='Amina H.',
                    role='Verified buyer',
                    text='Love the curated collections and the attention to detail. Highly recommend.',
                    rating=5,
                    order=2,
                ),
            ])

        if not PartnerBrand.objects.exists():
            for i, name in enumerate(['Apple', 'Samsung', 'Sony', 'Nike', 'Stripe', 'Linear', 'Vercel', 'Shopify']):
                PartnerBrand.objects.create(name=name, order=i)

        self.stdout.write(self.style.SUCCESS('Storefront seed complete'))
