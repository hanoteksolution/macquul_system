from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Permission(models.Model):
    """
    Individual permission that can be granted to users
    """
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=50, unique=True)  # e.g., 'view_dashboard', 'manage_users'
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, default='general')  # e.g., 'dashboard', 'users', 'products'
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['category', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.code})"


class Role(models.Model):
    """
    Role that groups multiple permissions
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    permissions = models.ManyToManyField(Permission, blank=True)
    is_default = models.BooleanField(default=False)  # Default role for new users
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name


class UserPermission(models.Model):
    """
    User's permissions (role-based + individual permissions)
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='custom_permissions')
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)
    additional_permissions = models.ManyToManyField(Permission, blank=True)  # Extra permissions beyond role
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.role.name if self.role else 'No Role'}"
    
    def get_all_permissions(self):
        """Get all permissions for this user (role + additional)"""
        permissions = set()
        
        # Add role permissions
        if self.role:
            permissions.update(self.role.permissions.all())
        
        # Add additional permissions
        permissions.update(self.additional_permissions.all())
        
        return list(permissions)
    
    def has_permission(self, permission_code):
        """Check if user has a specific permission"""
        all_permissions = self.get_all_permissions()
        return any(perm.code == permission_code for perm in all_permissions)
