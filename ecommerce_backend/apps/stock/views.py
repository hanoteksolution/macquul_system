from rest_framework import viewsets, permissions
from .models import StockMovement
from .serializers import StockMovementSerializer
from django.db import transaction
from rest_framework.exceptions import ValidationError


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'is_admin', False))


class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.select_related('product').all()
    serializer_class = StockMovementSerializer
    
    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

    @transaction.atomic
    def perform_create(self, serializer):
        movement = serializer.save()
        product = movement.product
        change = movement.quantity_change if movement.type == StockMovement.TYPE_IN else -abs(movement.quantity_change)
        # Ensure OUT does not create negative stock
        new_stock = product.stock + change
        if new_stock < 0:
            raise ValidationError('Resulting stock cannot be negative.')
        product.stock = new_stock
        product.save(update_fields=['stock'])
