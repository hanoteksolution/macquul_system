from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from urllib.request import urlopen
from apps.products.models import Category, Product


class Command(BaseCommand):
    help = 'Seed sample categories and products for electronics and stationery.'

    def handle(self, *args, **options):
        User = get_user_model()
        # Ensure an admin exists (email: admin@example.com / password: admin123)
        if not User.objects.filter(email='admin@example.com').exists():
            admin = User.objects.create_superuser(
                email='admin@example.com', username='admin', password='admin123', first_name='Admin', last_name='User'
            )
            admin.is_admin = True
            admin.save(update_fields=['is_admin'])
            self.stdout.write(self.style.SUCCESS('Created default admin: admin@example.com / admin123'))

        electronics, _ = Category.objects.get_or_create(
            name='Electronics',
            defaults={'description': 'Electronic devices', 'icon': '📱'},
        )
        stationery, _ = Category.objects.get_or_create(
            name='Stationery',
            defaults={'description': 'Stationery items', 'icon': '📝'},
        )

        # product tuples: (category, name, description, price, stock, image_url)
        products = [
            (electronics, 'Laptop Pro 14"', 'High performance laptop', 1299.99, 15, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop'),
            (electronics, 'Wireless Headphones', 'Noise cancelling over-ear', 199.99, 40, 'https://images.unsplash.com/photo-1518447532465-9a4bf7b2ae49?q=80&w=1200&auto=format&fit=crop'),
            (electronics, 'Smartphone X', 'OLED display smartphone', 899.99, 25, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop'),
            (stationery, 'A4 Notebook', '200 pages ruled notebook', 3.99, 200, 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop'),
            (stationery, 'Gel Pen Pack', 'Pack of 10 blue pens', 4.49, 150, 'https://images.unsplash.com/photo-1520288675369-84b9b8c1cf7b?q=80&w=1200&auto=format&fit=crop'),
            (stationery, 'Stapler', 'Standard stapler', 6.99, 80, 'https://images.unsplash.com/photo-1583467875819-1c1c449dd783?q=80&w=1200&auto=format&fit=crop'),
        ]

        created = 0
        for idx, (cat, name, desc, price, stock, image_url) in enumerate(products, start=1):
            obj, was_created = Product.objects.get_or_create(
                name=name, category=cat,
                defaults={
                    'description': desc,
                    'price': price,
                    'stock': stock,
                }
            )
            # Attach or backfill image if missing
            if not obj.image:
                try:
                    with urlopen(image_url) as resp:
                        data = resp.read()
                        filename = f"seed_{idx}.jpg"
                        obj.image.save(filename, ContentFile(data), save=True)
                except Exception:
                    pass
            if was_created:
                created += 1
        self.stdout.write(self.style.SUCCESS(f'Seeded {created} products.'))
