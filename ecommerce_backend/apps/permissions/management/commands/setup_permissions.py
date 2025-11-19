from django.core.management.base import BaseCommand
from apps.permissions.models import Permission, Role


class Command(BaseCommand):
    help = 'Set up default permissions and roles for the admin system'

    def handle(self, *args, **options):
        self.stdout.write('Setting up default permissions and roles...')

        # Define all available permissions
        permissions_data = [
            # Dashboard permissions
            {'name': 'View Dashboard', 'code': 'view_dashboard', 'category': 'dashboard', 'description': 'Can view the admin dashboard'},
            {'name': 'View Analytics', 'code': 'view_analytics', 'category': 'dashboard', 'description': 'Can view analytics and reports'},
            
            # User management permissions
            {'name': 'View Users', 'code': 'view_users', 'category': 'users', 'description': 'Can view user list'},
            {'name': 'Create Users', 'code': 'create_users', 'category': 'users', 'description': 'Can create new users'},
            {'name': 'Edit Users', 'code': 'edit_users', 'category': 'users', 'description': 'Can edit user details'},
            {'name': 'Delete Users', 'code': 'delete_users', 'category': 'users', 'description': 'Can delete users'},
            {'name': 'Manage User Permissions', 'code': 'manage_user_permissions', 'category': 'users', 'description': 'Can assign roles and permissions to users'},
            
            # Product management permissions
            {'name': 'View Products', 'code': 'view_products', 'category': 'products', 'description': 'Can view product list'},
            {'name': 'Create Products', 'code': 'create_products', 'category': 'products', 'description': 'Can create new products'},
            {'name': 'Edit Products', 'code': 'edit_products', 'category': 'products', 'description': 'Can edit product details'},
            {'name': 'Delete Products', 'code': 'delete_products', 'category': 'products', 'description': 'Can delete products'},
            {'name': 'Manage Categories', 'code': 'manage_categories', 'category': 'products', 'description': 'Can manage product categories'},
            
            # Order management permissions
            {'name': 'View Orders', 'code': 'view_orders', 'category': 'orders', 'description': 'Can view order list'},
            {'name': 'Edit Orders', 'code': 'edit_orders', 'category': 'orders', 'description': 'Can edit order details'},
            {'name': 'Delete Orders', 'code': 'delete_orders', 'category': 'orders', 'description': 'Can delete orders'},
            {'name': 'Process Orders', 'code': 'process_orders', 'category': 'orders', 'description': 'Can process and fulfill orders'},
            
            # Inventory management permissions
            {'name': 'View Inventory', 'code': 'view_inventory', 'category': 'inventory', 'description': 'Can view inventory levels'},
            {'name': 'Manage Inventory', 'code': 'manage_inventory', 'category': 'inventory', 'description': 'Can add/remove inventory'},
            {'name': 'View Stock Reports', 'code': 'view_stock_reports', 'category': 'inventory', 'description': 'Can view stock reports'},
            
            # Settings permissions
            {'name': 'View Settings', 'code': 'view_settings', 'category': 'settings', 'description': 'Can view system settings'},
            {'name': 'Edit Settings', 'code': 'edit_settings', 'category': 'settings', 'description': 'Can modify system settings'},
            
            # POS permissions
            {'name': 'Use POS', 'code': 'use_pos', 'category': 'pos', 'description': 'Can use the Point of Sale system'},
            {'name': 'View POS Reports', 'code': 'view_pos_reports', 'category': 'pos', 'description': 'Can view POS sales reports'},
            
            # Role management permissions
            {'name': 'View Roles', 'code': 'view_roles', 'category': 'permissions', 'description': 'Can view roles and permissions'},
            {'name': 'Manage Roles', 'code': 'manage_roles', 'category': 'permissions', 'description': 'Can create and edit roles'},
        ]

        # Create permissions
        created_permissions = {}
        for perm_data in permissions_data:
            permission, created = Permission.objects.get_or_create(
                code=perm_data['code'],
                defaults={
                    'name': perm_data['name'],
                    'description': perm_data['description'],
                    'category': perm_data['category']
                }
            )
            created_permissions[perm_data['code']] = permission
            if created:
                self.stdout.write(f'Created permission: {permission.name}')

        # Define roles with their permissions
        roles_data = [
            {
                'name': 'Super Admin',
                'description': 'Full access to all features',
                'permissions': list(created_permissions.keys()),  # All permissions
                'is_default': False
            },
            {
                'name': 'Admin',
                'description': 'Administrative access with some restrictions',
                'permissions': [
                    'view_dashboard', 'view_analytics',
                    'view_users', 'create_users', 'edit_users',
                    'view_products', 'create_products', 'edit_products', 'manage_categories',
                    'view_orders', 'edit_orders', 'process_orders',
                    'view_inventory', 'manage_inventory', 'view_stock_reports',
                    'view_settings', 'edit_settings',
                    'use_pos', 'view_pos_reports'
                ],
                'is_default': False
            },
            {
                'name': 'Manager',
                'description': 'Management access to products, orders, and inventory',
                'permissions': [
                    'view_dashboard',
                    'view_products', 'create_products', 'edit_products', 'manage_categories',
                    'view_orders', 'edit_orders', 'process_orders',
                    'view_inventory', 'manage_inventory', 'view_stock_reports',
                    'use_pos', 'view_pos_reports'
                ],
                'is_default': False
            },
            {
                'name': 'Staff',
                'description': 'Basic staff access to view and process orders',
                'permissions': [
                    'view_dashboard',
                    'view_products',
                    'view_orders', 'process_orders',
                    'view_inventory',
                    'use_pos'
                ],
                'is_default': True
            },
            {
                'name': 'Viewer',
                'description': 'Read-only access to most features',
                'permissions': [
                    'view_dashboard',
                    'view_products',
                    'view_orders',
                    'view_inventory'
                ],
                'is_default': False
            }
        ]

        # Create roles
        for role_data in roles_data:
            role, created = Role.objects.get_or_create(
                name=role_data['name'],
                defaults={
                    'description': role_data['description'],
                    'is_default': role_data['is_default']
                }
            )
            
            # Set permissions for the role
            role_permissions = [created_permissions[code] for code in role_data['permissions']]
            role.permissions.set(role_permissions)
            
            if created:
                self.stdout.write(f'Created role: {role.name} with {len(role_permissions)} permissions')
            else:
                self.stdout.write(f'Updated role: {role.name} with {len(role_permissions)} permissions')

        self.stdout.write(self.style.SUCCESS('Successfully set up permissions and roles!'))
        self.stdout.write(f'Created {len(permissions_data)} permissions and {len(roles_data)} roles.')
