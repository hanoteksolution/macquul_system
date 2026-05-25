from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class Category(models.Model):
    """
    Product category — supports parent categories and subcategories.
  """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
    )
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    icon = models.CharField(
        max_length=100,
        blank=True,
        help_text='Emoji or short label shown when no image is uploaded (e.g. 📱 or Electronics)',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'categories'
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ['parent_id', 'name']
        constraints = [
            models.UniqueConstraint(
                fields=['parent', 'name'],
                name='unique_category_name_per_parent',
            ),
        ]

    def __str__(self):
        if self.parent_id:
            return f'{self.parent.name} › {self.name}'
        return self.name

    @property
    def image_url(self):
        if self.image:
            return self.image.url
        return None

    @property
    def is_parent(self):
        return self.children.exists()

    def get_descendant_ids(self):
        """Return this category id and all nested child category ids."""
        ids = [self.pk]
        for child in self.children.all():
            ids.extend(child.get_descendant_ids())
        return ids

    def product_count_including_children(self):
        descendant_ids = self.get_descendant_ids()
        return Product.objects.filter(category_id__in=descendant_ids).count()


class Product(models.Model):
    """
    Product model for electronics and stationery
    """
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products',
    )
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'products'
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - ${self.price}"

    @property
    def is_in_stock(self):
        return self.stock > 0

    @property
    def image_url(self):
        if self.image:
            return self.image.url
        return None
