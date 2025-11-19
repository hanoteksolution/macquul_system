from rest_framework import serializers
from .models import InventoryTransaction, Supplier, PurchaseOrder, PurchaseOrderItem, FinancialReport
from apps.products.models import Product


class InventoryTransactionSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = InventoryTransaction
        fields = [
            'id', 'product', 'product_name', 'transaction_type', 'quantity', 
            'unit_cost', 'total_cost', 'reference_number', 'notes', 
            'created_by', 'created_by_name', 'created_at'
        ]
        read_only_fields = ['id', 'total_cost', 'created_at']


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['id', 'name', 'contact_person', 'email', 'phone', 'address', 'created_at']
        read_only_fields = ['id', 'created_at']


class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = PurchaseOrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_cost', 'total_cost']
        read_only_fields = ['id', 'total_cost']


class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True, read_only=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = PurchaseOrder
        fields = [
            'id', 'supplier', 'supplier_name', 'order_number', 'status', 
            'order_date', 'expected_date', 'total_amount', 'notes', 
            'created_by', 'created_by_name', 'items'
        ]
        read_only_fields = ['id', 'order_date']


class FinancialReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialReport
        fields = [
            'id', 'report_type', 'start_date', 'end_date', 'total_sales', 
            'total_purchases', 'total_expenses', 'net_profit', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class InventoryStatsSerializer(serializers.Serializer):
    total_products = serializers.IntegerField()
    low_stock_products = serializers.IntegerField()
    out_of_stock_products = serializers.IntegerField()
    total_inventory_value = serializers.DecimalField(max_digits=12, decimal_places=2)
    recent_transactions = InventoryTransactionSerializer(many=True)


class FinancialStatsSerializer(serializers.Serializer):
    today_sales = serializers.DecimalField(max_digits=12, decimal_places=2)
    this_month_sales = serializers.DecimalField(max_digits=12, decimal_places=2)
    this_year_sales = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_orders = serializers.IntegerField()
    pending_orders = serializers.IntegerField()
    completed_orders = serializers.IntegerField()
    average_order_value = serializers.DecimalField(max_digits=12, decimal_places=2)
