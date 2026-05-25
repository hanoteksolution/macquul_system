from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Prefetch
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return bool(
            getattr(user, 'is_admin', False)
            or getattr(user, 'is_staff', False)
            or getattr(user, 'is_superuser', False)
        )


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']

    def get_queryset(self):
        children_qs = Category.objects.order_by('name')
        qs = Category.objects.prefetch_related(
            Prefetch('children', queryset=children_qs),
        ).select_related('parent')

        parent = self.request.query_params.get('parent')
        if parent == 'null' or parent == '':
            return qs.filter(parent__isnull=True)
        if parent is not None and parent != 'all':
            try:
                return qs.filter(parent_id=int(parent))
            except (TypeError, ValueError):
                pass
        return qs

    @action(detail=False, methods=['get'], url_path='tree')
    def tree(self, request):
        """Root categories with nested children (for admin / storefront)."""
        roots = self.get_queryset().filter(parent__isnull=True)
        serializer = self.get_serializer(roots, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='assignable')
    def assignable(self, request):
        """Leaf categories only — valid targets when creating products."""
        leaves = Category.objects.filter(children__isnull=True).select_related('parent').order_by(
            'parent__name', 'name'
        )
        data = [
            {
                'id': c.id,
                'name': c.name,
                'parent_id': c.parent_id,
                'parent_name': c.parent.name if c.parent_id else None,
                'label': f'{c.parent.name} › {c.name}' if c.parent_id else c.name,
            }
            for c in leaves
        ]
        return Response(data)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category', 'category__parent').all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'category__name', 'category__parent__name']
    ordering_fields = ['price', 'created_at', 'name']
