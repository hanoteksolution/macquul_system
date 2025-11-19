from rest_framework import viewsets, permissions
from .models import BookLocation
from .serializers import BookLocationSerializer


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'is_admin', False))


class BookLocationViewSet(viewsets.ModelViewSet):
    queryset = BookLocation.objects.select_related('product').all()
    serializer_class = BookLocationSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]
