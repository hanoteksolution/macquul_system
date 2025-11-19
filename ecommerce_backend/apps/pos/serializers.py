from rest_framework import serializers
from .models import BookLocation


class BookLocationSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = BookLocation
        fields = ['id', 'product', 'product_name', 'row', 'column']
        read_only_fields = ['id']

    def validate(self, attrs):
        row = attrs.get('row')
        column = attrs.get('column')
        if row <= 0 or column <= 0:
            raise serializers.ValidationError('Row and Column must be positive integers.')
        return attrs
