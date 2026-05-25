from django.core.management.base import BaseCommand
from apps.products.models import Category, Product


SUBCATEGORIES = {
    'Electronics': [
        ('Phones', '📱', 'Smartphones and mobile devices'),
        ('Chargers', '🔌', 'Chargers, cables, and power adapters'),
        ('Headphones', '🎧', 'Headphones, earbuds, and audio gear'),
        ('Laptops', '💻', 'Laptops and portable computers'),
    ],
    'Stationery': [
        ('Pens', '🖊️', 'Pens and writing instruments'),
        ('Notebooks', '📓', 'Notebooks and paper products'),
        ('Office supplies', '📎', 'Staplers, clips, and desk essentials'),
    ],
}


class Command(BaseCommand):
    help = 'Create subcategories under parent categories (Electronics, Stationery, etc.)'

    def handle(self, *args, **options):
        created = 0
        for parent_name, children in SUBCATEGORIES.items():
            parent, _ = Category.objects.get_or_create(
                name=parent_name,
                parent=None,
                defaults={'description': f'{parent_name} department', 'icon': '🛍️'},
            )
            for child_name, icon, description in children:
                _, was_created = Category.objects.get_or_create(
                    name=child_name,
                    parent=parent,
                    defaults={'description': description, 'icon': icon},
                )
                if was_created:
                    created += 1
                    self.stdout.write(f'  + {parent_name} › {child_name}')

        # Move products from parent categories to matching subcategories when possible
        moved = 0
        mapping = {
            ('Electronics', 'Wireless Headphones'): 'Headphones',
            ('Electronics', 'Smartphone X'): 'Phones',
            ('Electronics', 'Laptop Pro 14"'): 'Laptops',
            ('Stationery', 'A4 Notebook'): 'Notebooks',
            ('Stationery', 'Gel Pen Pack'): 'Pens',
            ('Stationery', 'Stapler'): 'Office supplies',
        }
        for (parent_name, product_name), sub_name in mapping.items():
            try:
                sub = Category.objects.get(name=sub_name, parent__name=parent_name)
                updated = Product.objects.filter(
                    name=product_name,
                    category__name=parent_name,
                    category__parent__isnull=True,
                ).update(category=sub)
                moved += updated
            except Category.DoesNotExist:
                pass

        self.stdout.write(
            self.style.SUCCESS(
                f'Done. Created {created} subcategories; reassigned {moved} product(s) to subcategories.'
            )
        )
