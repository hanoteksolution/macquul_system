from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('settings', '0003_sitesettings_tiktok_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='sitesettings',
            name='default_locale',
            field=models.CharField(default='EN', help_text='Default language code shown in header', max_length=10),
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='member_discount_percent',
            field=models.PositiveSmallIntegerField(default=15),
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='promo_code',
            field=models.CharField(blank=True, default='WELCOME15', help_text='Member discount promo code', max_length=40),
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='search_placeholder',
            field=models.CharField(default='Search products, brands...', help_text='Header search input placeholder', max_length=120),
        ),
    ]
