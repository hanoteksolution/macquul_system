from rest_framework import serializers
from .models import Category, Product


class CategoryChildSerializer(serializers.ModelSerializer):
    """Shallow serializer for subcategories on list/tree responses."""

    image_url = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'description', 'icon', 'image_url',
            'parent_id', 'product_count',
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url

    def get_product_count(self, obj):
        return obj.product_count_including_children()


class CategorySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()
    parent_id = serializers.PrimaryKeyRelatedField(
        source='parent',
        queryset=Category.objects.all(),
        allow_null=True,
        required=False,
    )
    parent_name = serializers.CharField(source='parent.name', read_only=True, allow_null=True)
    children = CategoryChildSerializer(many=True, read_only=True)
    is_parent = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'description', 'icon', 'image', 'image_url',
            'parent_id', 'parent_name', 'children', 'is_parent',
            'product_count', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'image_url',
            'product_count', 'parent_name', 'children', 'is_parent',
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url

    def get_product_count(self, obj):
        return obj.product_count_including_children()

    def get_is_parent(self, obj):
        if hasattr(obj, '_prefetched_objects_cache') and 'children' in obj._prefetched_objects_cache:
            return bool(obj.children.all())
        return obj.children.exists()

    def to_internal_value(self, data):
        """FormData sends '' for empty parent_id; normalize to null."""
        if hasattr(data, 'get'):
            parent_raw = data.get('parent_id')
            if parent_raw in ('', 'null', 'None'):
                if hasattr(data, '_mutable'):
                    mutable = data.copy()
                    mutable['parent_id'] = None
                    data = mutable
                elif isinstance(data, dict):
                    data = {**data, 'parent_id': None}
        return super().to_internal_value(data)

    def validate_parent_id(self, parent):
        instance = self.instance
        if not parent or not instance:
            return parent
        if parent.pk == instance.pk:
            raise serializers.ValidationError('A category cannot be its own parent.')
        ancestor = parent
        while ancestor is not None:
            if ancestor.pk == instance.pk:
                raise serializers.ValidationError('Cannot set a subcategory as parent (circular hierarchy).')
            ancestor = ancestor.parent
        return parent

    def validate(self, attrs):
        parent = attrs.get('parent', getattr(self.instance, 'parent', None))
        name = attrs.get('name', getattr(self.instance, 'name', None))
        if name:
            qs = Category.objects.filter(name__iexact=name.strip(), parent=parent)
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError(
                    {'name': 'A category with this name already exists under the same parent.'}
                )
        return attrs


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source='category', queryset=Category.objects.all(), write_only=True
    )
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'category', 'category_id',
            'image', 'image_url', 'stock', 'is_active', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def validate_category_id(self, category):
        if category.children.exists():
            raise serializers.ValidationError(
                'Assign products to a subcategory (e.g. Phones under Electronics), not a parent category.'
            )
        return category

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError('Stock cannot be negative.')
        return value
