from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Permission, Role, UserPermission
from .serializers import (
    PermissionSerializer, 
    RoleSerializer, 
    UserPermissionSerializer,
    UserPermissionSummarySerializer
)
from apps.users.models import User


# Permission Management Views
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def permission_list_view(request):
    """List all permissions or create a new permission"""
    if not request.user.is_staff:
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'GET':
        permissions_list = Permission.objects.all()
        serializer = PermissionSerializer(permissions_list, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = PermissionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Role Management Views
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def role_list_view(request):
    """List all roles or create a new role"""
    if not request.user.is_staff:
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'GET':
        roles = Role.objects.all()
        serializer = RoleSerializer(roles, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = RoleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def role_detail_view(request, role_id):
    """Get, update, or delete a specific role"""
    if not request.user.is_staff:
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    role = get_object_or_404(Role, id=role_id)
    
    if request.method == 'GET':
        serializer = RoleSerializer(role)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = RoleSerializer(role, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        role.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# User Permission Management Views
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_permission_list_view(request):
    """List all user permissions"""
    if not request.user.is_staff:
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    user_permissions = UserPermission.objects.all()
    serializer = UserPermissionSummarySerializer(user_permissions, many=True)
    return Response(serializer.data)


@api_view(['GET', 'PUT'])
@permission_classes([permissions.IsAuthenticated])
def user_permission_detail_view(request, user_id):
    """Get or update user permissions"""
    if not request.user.is_staff:
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    user = get_object_or_404(User, id=user_id)
    user_permission, created = UserPermission.objects.get_or_create(user=user)
    
    if request.method == 'GET':
        serializer = UserPermissionSerializer(user_permission)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UserPermissionSerializer(user_permission, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_permissions_view(request):
    """Get current user's permissions"""
    try:
        user_permission = UserPermission.objects.get(user=request.user)
        serializer = UserPermissionSerializer(user_permission)
        return Response(serializer.data)
    except UserPermission.DoesNotExist:
        return Response({
            'user': request.user.id,
            'role': None,
            'additional_permissions': [],
            'all_permissions': []
        })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def check_permission_view(request):
    """Check if current user has a specific permission"""
    permission_code = request.data.get('permission_code')
    if not permission_code:
        return Response({'error': 'permission_code is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user_permission = UserPermission.objects.get(user=request.user)
        has_permission = user_permission.has_permission(permission_code)
    except UserPermission.DoesNotExist:
        has_permission = False
    
    return Response({
        'permission_code': permission_code,
        'has_permission': has_permission
    })
