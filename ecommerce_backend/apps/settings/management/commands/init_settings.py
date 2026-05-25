from django.core.management.base import BaseCommand
from apps.settings.models import SiteSettings


class Command(BaseCommand):
    help = 'Initialize default site settings'

    def handle(self, *args, **options):
        try:
            # Check if settings already exist
            if SiteSettings.objects.exists():
                self.stdout.write(
                    self.style.WARNING('Site settings already exist. Skipping initialization.')
                )
                return

            # Create default settings
            settings = SiteSettings.objects.create(
                site_name='Safari Ecommerce',
                site_description='Premium curated commerce — exceptional products, trusted delivery, and a world-class shopping experience.',
                contact_email='support@estore.com',
                contact_phone='+000 000 0000',
                address='123 Business Street, City, Country',
                primary_color='#3B82F6',
                secondary_color='#8B5CF6',
                accent_color='#F59E0B',
                currency='USD',
                tax_rate=10.00,
                shipping_fee=5.99,
                free_shipping_threshold=50.00,
                enable_registration=True,
                enable_guest_checkout=True,
                enable_reviews=True,
                enable_wishlist=True,
                maintenance_mode=False,
                email_notifications=True,
                sms_notifications=False,
                order_notifications=True,
                stock_alerts=True
            )

            self.stdout.write(
                self.style.SUCCESS(f'Successfully created default site settings: {settings}')
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating default settings: {str(e)}')
            )
