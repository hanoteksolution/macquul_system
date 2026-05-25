from rest_framework import serializers
from decimal import Decimal
from apps.products.models import Product
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price', 'image_url']
        read_only_fields = ['id', 'price']

    def get_image_url(self, obj):
        product = getattr(obj, 'product', None)
        if not product or not product.image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(product.image.url)
        return product.image.url


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES, default=Order.STATUS_PENDING)
    customer_name = serializers.CharField(source='user.get_full_name', read_only=True)
    customer_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'customer_name', 'customer_email', 'customer_phone', 
            'shipping_address', 'total_price', 'status', 'tracking_number', 
            'notes', 'created_at', 'updated_at', 'items'
        ]
        read_only_fields = ['id', 'user', 'total_price', 'created_at', 'updated_at']

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError('Order must contain at least one item.')
        for item in value:
            if item['quantity'] <= 0:
                raise serializers.ValidationError('Item quantity must be at least 1.')
        return value

    def create(self, validated_data):
        request = self.context['request']
        items_data = validated_data.pop('items')
        user = request.user

        # Validate stock and calculate total
        total = Decimal('0.00')
        product_updates = []  # Collect stock decrements to apply after validation
        for item in items_data:
            product = Product.objects.select_for_update().get(pk=item['product'].id)
            qty = item['quantity']
            if product.stock < qty:
                raise serializers.ValidationError({
                    'items': [f"Insufficient stock for {product.name}. Available: {product.stock}"]
                })
            line_price = product.price * qty
            total += line_price
            product_updates.append((product, qty, line_price))

        order = Order.objects.create(user=user, total_price=total, status=Order.STATUS_PENDING)
        for product, qty, line_price in product_updates:
            OrderItem.objects.create(order=order, product=product, quantity=qty, price=product.price)
            # Stock deduction will be handled in view within a transaction to also log StockMovement
        return order
