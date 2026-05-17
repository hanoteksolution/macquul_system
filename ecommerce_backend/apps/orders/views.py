from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Sum, F, Count
from django.db.models.functions import TruncDate
from django.utils import timezone
from django.conf import settings
from datetime import timedelta
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

    @action(detail=False, methods=['get'], url_path='dashboard')
    def dashboard(self, request):
        """Admin dashboard: recent orders, top sellers, revenue series."""
        if not getattr(request.user, 'is_admin', False):
            return Response({'detail': 'Admin only.'}, status=status.HTTP_403_FORBIDDEN)

        recent_qs = (
            Order.objects.select_related('user')
            .prefetch_related('items__product')
            .order_by('-created_at')[:10]
        )
        recent_orders = []
        for order in recent_qs:
            first_item = order.items.first()
            recent_orders.append({
                'id': order.id,
                'customer_name': order.customer_name or (order.user.get_full_name() if order.user else 'Guest'),
                'customer_email': order.customer_email or (order.user.email if order.user else ''),
                'total_price': float(order.total_price),
                'status': order.status,
                'created_at': order.created_at.isoformat(),
                'item_count': order.items.count(),
                'preview': first_item.product.name if first_item else '—',
            })

        top_qs = (
            OrderItem.objects.values('product_id', 'product__name', 'product__image')
            .annotate(
                units_sold=Sum('quantity'),
                revenue=Sum(F('quantity') * F('price')),
            )
            .order_by('-units_sold')[:10]
        )
        top_products = []
        for row in top_qs:
            image_url = None
            img = row.get('product__image')
            if img:
                image_url = request.build_absolute_uri(f"{settings.MEDIA_URL}{img}")
            top_products.append({
                'product_id': row['product_id'],
                'name': row['product__name'],
                'image_url': image_url,
                'units_sold': row['units_sold'] or 0,
                'revenue': float(row['revenue'] or 0),
            })

        today = timezone.now().date()
        week_start = today - timedelta(days=6)
        daily = (
            Order.objects.filter(created_at__date__gte=week_start)
            .annotate(day=TruncDate('created_at'))
            .values('day')
            .annotate(revenue=Sum('total_price'), orders=Count('id'))
            .order_by('day')
        )
        daily_map = {d['day']: d for d in daily}
        revenue_week = []
        for i in range(7):
            d = week_start + timedelta(days=i)
            entry = daily_map.get(d, {})
            revenue_week.append({
                'name': d.strftime('%a'),
                'date': d.isoformat(),
                'revenue': float(entry.get('revenue') or 0),
                'orders': entry.get('orders') or 0,
            })

        month_start = today - timedelta(days=27)
        weekly = (
            Order.objects.filter(created_at__date__gte=month_start)
            .annotate(day=TruncDate('created_at'))
            .values('day')
            .annotate(revenue=Sum('total_price'), orders=Count('id'))
        )
        revenue_month = []
        for w in range(4):
            w_start = month_start + timedelta(days=w * 7)
            w_end = w_start + timedelta(days=6)
            rev = sum(
                float(x['revenue'] or 0)
                for x in weekly
                if x['day'] and w_start <= x['day'] <= w_end
            )
            ord_count = sum(
                x['orders'] or 0
                for x in weekly
                if x['day'] and w_start <= x['day'] <= w_end
            )
            revenue_month.append({
                'name': f'W{w + 1}',
                'revenue': rev,
                'orders': ord_count,
            })

        cat_sales = (
            OrderItem.objects.filter(product__category__isnull=False)
            .values('product__category__name')
            .annotate(value=Sum('quantity'))
            .order_by('-value')[:6]
        )
        category_breakdown = [
            {'name': c['product__category__name'] or 'Other', 'value': c['value'] or 0}
            for c in cat_sales
        ]

        products_count = Product.objects.count()
        orders_count = Order.objects.count()
        total_revenue = float(
            Order.objects.aggregate(t=Sum('total_price'))['t'] or 0
        )

        return Response({
            'stats': {
                'products': products_count,
                'orders': orders_count,
                'revenue': total_revenue,
            },
            'recent_orders': recent_orders,
            'top_products': top_products,
            'revenue_week': revenue_week,
            'revenue_month': revenue_month,
            'category_breakdown': category_breakdown,
        })
