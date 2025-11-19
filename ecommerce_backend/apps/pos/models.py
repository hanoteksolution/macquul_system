from django.db import models
from apps.products.models import Product


class BookLocation(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='book_locations')
    row = models.PositiveIntegerField()
    column = models.PositiveIntegerField()

    class Meta:
        db_table = 'book_locations'
        unique_together = ('row', 'column')
        ordering = ['row', 'column']

    def __str__(self):
        return f"{self.product.name} at ({self.row}, {self.column})"
