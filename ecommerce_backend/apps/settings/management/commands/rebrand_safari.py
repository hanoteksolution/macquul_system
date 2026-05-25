from django.core.management.base import BaseCommand
from apps.settings.models import SiteSettings


class Command(BaseCommand):
    help = 'Update site branding to Safari Ecommerce'

    def handle(self, *args, **options):
        settings = SiteSettings.get_settings()
        settings.site_name = 'Safari Ecommerce'
        settings.site_description = (
            'Premium curated commerce — exceptional products, trusted delivery, '
            'and a world-class shopping experience.'
        )
        settings.save()
        self.stdout.write(self.style.SUCCESS(f'Updated branding: {settings.site_name}'))
