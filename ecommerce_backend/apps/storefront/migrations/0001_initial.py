# Generated manually for storefront app

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Announcement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('position', models.CharField(choices=[('primary', 'Primary (left badge + headline)'), ('promo', 'Promo (center bar)')], default='promo', max_length=20)),
                ('badge_text', models.CharField(blank=True, help_text='e.g. NEW — only for primary', max_length=30)),
                ('text', models.CharField(max_length=255)),
                ('icon', models.CharField(choices=[('none', 'None'), ('truck', 'Truck'), ('gift', 'Gift'), ('headphones', 'Headphones'), ('sparkles', 'Sparkles')], default='none', max_length=20)),
                ('link', models.CharField(blank=True, max_length=500)),
                ('order', models.PositiveIntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Announcement',
                'verbose_name_plural': 'Announcements',
                'ordering': ['order', 'id'],
            },
        ),
        migrations.CreateModel(
            name='HomeSection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('section_key', models.CharField(choices=[('featured', 'Featured products'), ('categories', 'Shop by category'), ('flash_sale', 'Flash sale'), ('trending', 'Trending now'), ('testimonials', 'Testimonials'), ('brands', 'Partner brands'), ('newsletter', 'Newsletter')], max_length=40, unique=True)),
                ('title', models.CharField(max_length=120)),
                ('subtitle', models.CharField(blank=True, max_length=255)),
                ('badge_text', models.CharField(blank=True, max_length=60)),
                ('view_all_href', models.CharField(blank=True, max_length=500)),
                ('is_active', models.BooleanField(default=True)),
                ('config', models.JSONField(blank=True, default=dict)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Home section',
                'verbose_name_plural': 'Home sections',
            },
        ),
        migrations.CreateModel(
            name='NavLink',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('label', models.CharField(max_length=80)),
                ('href', models.CharField(max_length=500)),
                ('location', models.CharField(choices=[('header', 'Header'), ('footer', 'Footer'), ('both', 'Header & Footer')], default='header', max_length=10)),
                ('order', models.PositiveIntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('open_in_new_tab', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Navigation link',
                'verbose_name_plural': 'Navigation links',
                'ordering': ['order', 'id'],
            },
        ),
        migrations.CreateModel(
            name='PartnerBrand',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=80)),
                ('logo', models.ImageField(blank=True, null=True, upload_to='storefront/brands/')),
                ('link', models.URLField(blank=True)),
                ('order', models.PositiveIntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'ordering': ['order', 'id'],
            },
        ),
        migrations.CreateModel(
            name='Testimonial',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=80)),
                ('role', models.CharField(blank=True, max_length=80)),
                ('text', models.TextField()),
                ('rating', models.PositiveSmallIntegerField(default=5)),
                ('avatar', models.ImageField(blank=True, null=True, upload_to='storefront/testimonials/')),
                ('order', models.PositiveIntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['order', 'id'],
            },
        ),
    ]
