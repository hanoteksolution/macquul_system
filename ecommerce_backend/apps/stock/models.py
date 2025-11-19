from django.db import models
from apps.products.models import Product


class StockMovement(models.Model):
    TYPE_IN = 'IN'
    TYPE_OUT = 'OUT'
    TYPE_CHOICES = [
        (TYPE_IN, 'IN'),
        (TYPE_OUT, 'OUT'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='stock_movements')
    quantity_change = models.IntegerField()
    type = models.CharField(max_length=3, choices=TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'stock_movements'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.type} {self.quantity_change} for {self.product.name}"
