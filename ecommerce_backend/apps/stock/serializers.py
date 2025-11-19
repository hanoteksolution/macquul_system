from rest_framework import serializers
from .models import StockMovement


class StockMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = StockMovement
        fields = ['id', 'product', 'product_name', 'quantity_change', 'type', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_quantity_change(self, value):
        if value == 0:
            raise serializers.ValidationError('Quantity change cannot be zero.')
        return value
