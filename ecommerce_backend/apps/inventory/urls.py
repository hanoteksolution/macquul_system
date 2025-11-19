from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    InventoryTransactionViewSet, SupplierViewSet, PurchaseOrderViewSet,
    FinancialReportViewSet, InventoryStatsViewSet, FinancialStatsViewSet
)

router = DefaultRouter()
router.register(r'transactions', InventoryTransactionViewSet)
router.register(r'suppliers', SupplierViewSet)
router.register(r'purchase-orders', PurchaseOrderViewSet)
router.register(r'financial-reports', FinancialReportViewSet)
router.register(r'inventory-stats', InventoryStatsViewSet, basename='inventory-stats')
router.register(r'financial-stats', FinancialStatsViewSet, basename='financial-stats')

urlpatterns = [
    path('', include(router.urls)),
]
