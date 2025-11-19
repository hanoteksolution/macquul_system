from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Q, F
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal

from .models import InventoryTransaction, Supplier, PurchaseOrder, PurchaseOrderItem, FinancialReport
from .serializers import (
    InventoryTransactionSerializer, SupplierSerializer, PurchaseOrderSerializer,
    FinancialReportSerializer, InventoryStatsSerializer, FinancialStatsSerializer
)
from apps.products.models import Product
from apps.orders.models import Order


class InventoryTransactionViewSet(viewsets.ModelViewSet):
    queryset = InventoryTransaction.objects.all()
    serializer_class = InventoryTransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated]


class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class FinancialReportViewSet(viewsets.ModelViewSet):
    queryset = FinancialReport.objects.all()
    serializer_class = FinancialReportSerializer
    permission_classes = [IsAuthenticated]


class InventoryStatsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        # Get inventory statistics
        total_products = Product.objects.count()
        low_stock_products = Product.objects.filter(stock__lte=10).count()
        out_of_stock_products = Product.objects.filter(stock=0).count()
        
        # Calculate total inventory value
        total_inventory_value = Product.objects.aggregate(
            total=Sum(F('stock') * F('price'))
        )['total'] or Decimal('0.00')
        
        # Get recent transactions
        recent_transactions = InventoryTransaction.objects.select_related('product', 'created_by')[:10]
        
        data = {
            'total_products': total_products,
            'low_stock_products': low_stock_products,
            'out_of_stock_products': out_of_stock_products,
            'total_inventory_value': total_inventory_value,
            'recent_transactions': InventoryTransactionSerializer(recent_transactions, many=True).data
        }
        
        serializer = InventoryStatsSerializer(data)
        return Response(serializer.data)


class FinancialStatsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        today = timezone.now().date()
        this_month_start = today.replace(day=1)
        this_year_start = today.replace(month=1, day=1)
        
        # Calculate sales statistics
        today_sales = Order.objects.filter(
            created_at__date=today,
            status__in=['delivered', 'shipped']
        ).aggregate(total=Sum('total_price'))['total'] or Decimal('0.00')
        
        this_month_sales = Order.objects.filter(
            created_at__date__gte=this_month_start,
            status__in=['delivered', 'shipped']
        ).aggregate(total=Sum('total_price'))['total'] or Decimal('0.00')
        
        this_year_sales = Order.objects.filter(
            created_at__date__gte=this_year_start,
            status__in=['delivered', 'shipped']
        ).aggregate(total=Sum('total_price'))['total'] or Decimal('0.00')
        
        # Order statistics
        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status__in=['pending', 'confirmed', 'processing']).count()
        completed_orders = Order.objects.filter(status='delivered').count()
        
        # Average order value
        avg_order_value = Order.objects.filter(
            status__in=['delivered', 'shipped']
        ).aggregate(avg=Sum('total_price'))['avg'] or Decimal('0.00')
        
        if total_orders > 0:
            avg_order_value = avg_order_value / total_orders
        
        data = {
            'today_sales': today_sales,
            'this_month_sales': this_month_sales,
            'this_year_sales': this_year_sales,
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'completed_orders': completed_orders,
            'average_order_value': avg_order_value
        }
        
        serializer = FinancialStatsSerializer(data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def generate_report(self, request):
        report_type = request.data.get('report_type', 'monthly')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        
        if not start_date or not end_date:
            return Response(
                {'error': 'start_date and end_date are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Convert string dates to date objects
        start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        
        # Calculate sales in date range
        total_sales = Order.objects.filter(
            created_at__date__range=[start_date, end_date],
            status__in=['delivered', 'shipped']
        ).aggregate(total=Sum('total_price'))['total'] or Decimal('0.00')
        
        # Calculate purchases (inventory transactions)
        total_purchases = InventoryTransaction.objects.filter(
            created_at__date__range=[start_date, end_date],
            transaction_type='purchase'
        ).aggregate(total=Sum('total_cost'))['total'] or Decimal('0.00')
        
        # For now, expenses are 0 (can be extended later)
        total_expenses = Decimal('0.00')
        
        # Create financial report
        report = FinancialReport.objects.create(
            report_type=report_type,
            start_date=start_date,
            end_date=end_date,
            total_sales=total_sales,
            total_purchases=total_purchases,
            total_expenses=total_expenses
        )
        
        report.calculate_profit()
        report.save()
        
        serializer = FinancialReportSerializer(report)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
