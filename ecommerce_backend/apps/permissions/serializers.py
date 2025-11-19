from rest_framework import serializers
from .models import Permission, Role, UserPermission
from apps.users.models import User


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'code', 'description', 'category']


class RoleSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)
    permission_ids = serializers.ListField(
        child=serializers.IntegerField(), 
        write_only=True, 
        required=False
    )
    
    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'permissions', 'permission_ids', 'is_default']
    
    def create(self, validated_data):
        permission_ids = validated_data.pop('permission_ids', [])
        role = Role.objects.create(**validated_data)
        if permission_ids:
            role.permissions.set(permission_ids)
        return role
    
    def update(self, instance, validated_data):
        permission_ids = validated_data.pop('permission_ids', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if permission_ids is not None:
            instance.permissions.set(permission_ids)
        
        return instance


class UserPermissionSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
    additional_permissions = PermissionSerializer(many=True, read_only=True)
    role_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    additional_permission_ids = serializers.ListField(
        child=serializers.IntegerField(), 
        write_only=True, 
        required=False
    )
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    all_permissions = serializers.SerializerMethodField()
    
    class Meta:
        model = UserPermission
        fields = [
            'id', 'user', 'user_username', 'user_email', 'role', 'role_id',
            'additional_permissions', 'additional_permission_ids', 'all_permissions'
        ]
    
    def get_all_permissions(self, obj):
        return PermissionSerializer(obj.get_all_permissions(), many=True).data
    
    def update(self, instance, validated_data):
        role_id = validated_data.pop('role_id', None)
        additional_permission_ids = validated_data.pop('additional_permission_ids', None)
        
        if role_id is not None:
            instance.role_id = role_id
        
        instance.save()
        
        if additional_permission_ids is not None:
            instance.additional_permissions.set(additional_permission_ids)
        
        return instance


class UserPermissionSummarySerializer(serializers.ModelSerializer):
    """Simplified serializer for listing users with their permissions"""
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    role_name = serializers.CharField(source='role.name', read_only=True)
    permission_count = serializers.SerializerMethodField()
    
    class Meta:
        model = UserPermission
        fields = ['id', 'user', 'username', 'email', 'role_name', 'permission_count']
    
    def get_permission_count(self, obj):
        return len(obj.get_all_permissions())
