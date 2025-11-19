from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.db import transaction
from .models import Order, OrderItem
from apps.products.models import Product
from apps.stock.models import StockMovement
from .serializers import OrderSerializer


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'is_admin', False):
            return Order.objects.prefetch_related('items').all()
        return Order.objects.prefetch_related('items').filter(user=user)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        items_data = serializer.validated_data.pop('items')
        user = request.user

        # Lock products and validate stock, compute total
        total = 0
        product_info = []
        for item in items_data:
            product = Product.objects.select_for_update().get(pk=item['product'].id)
            qty = item['quantity']
            if product.stock < qty:
                return Response({'detail': f'Insufficient stock for {product.name}. Available: {product.stock}'}, status=status.HTTP_400_BAD_REQUEST)
            line_total = float(product.price) * qty
            total += line_total
            product_info.append((product, qty))

        order = Order.objects.create(user=user, total_price=total)
        # Create items and deduct stock + log movement
        for product, qty in product_info:
            OrderItem.objects.create(order=order, product=product, quantity=qty, price=product.price)
            product.stock -= qty
            product.save(update_fields=['stock'])
            StockMovement.objects.create(product=product, quantity_change=-qty, type=StockMovement.TYPE_OUT)

        out_serializer = self.get_serializer(order)
        headers = self.get_success_headers(out_serializer.data)
        return Response(out_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        # Allow admin/user to update status only; other fields are read-only
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        if not getattr(request.user, 'is_admin', False) and request.user != instance.user:
            return Response({'detail': 'Not permitted.'}, status=status.HTTP_403_FORBIDDEN)
        status_value = request.data.get('status')
        if status_value not in dict(Order.STATUS_CHOICES):
            return Response({'detail': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        instance.status = status_value
        instance.save(update_fields=['status'])
        return Response(self.get_serializer(instance).data)
