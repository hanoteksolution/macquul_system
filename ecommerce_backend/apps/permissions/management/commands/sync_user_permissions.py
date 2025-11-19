from django.core.management.base import BaseCommand
from apps.permissions.models import Role, UserPermission
from apps.users.models import User


class Command(BaseCommand):
    help = 'Create UserPermission records for all users who dont have them'

    def handle(self, *args, **options):
        self.stdout.write('Syncing user permissions...')

        try:
            # Get the default role (Staff)
            default_role = Role.objects.get(is_default=True)
            self.stdout.write(f'Using default role: {default_role.name}')

            # Get all users
            all_users = User.objects.all()
            self.stdout.write(f'Found {all_users.count()} total users')

            created_count = 0
            updated_count = 0

            for user in all_users:
                user_permission, created = UserPermission.objects.get_or_create(
                    user=user,
                    defaults={'role': default_role if not user.is_staff else None}
                )
                
                if created:
                    created_count += 1
                    # Assign appropriate role based on user type
                    if user.is_superuser:
                        try:
                            super_admin_role = Role.objects.get(name='Super Admin')
                            user_permission.role = super_admin_role
                            user_permission.save()
                            role_name = 'Super Admin'
                        except Role.DoesNotExist:
                            role_name = 'No Role'
                    elif user.is_staff:
                        try:
                            admin_role = Role.objects.get(name='Admin')
                            user_permission.role = admin_role
                            user_permission.save()
                            role_name = 'Admin'
                        except Role.DoesNotExist:
                            role_name = 'No Role'
                    else:
                        role_name = default_role.name
                    
                    self.stdout.write(f'Created permissions for: {user.username} ({user.email}) - Role: {role_name}')
                else:
                    updated_count += 1
                    self.stdout.write(f'Already exists: {user.username} ({user.email}) - Role: {user_permission.role.name if user_permission.role else "No Role"}')

            self.stdout.write(self.style.SUCCESS(f'Sync complete! Created: {created_count}, Already existed: {updated_count}'))

        except Role.DoesNotExist:
            self.stdout.write(self.style.ERROR('Default role not found. Please run setup_permissions first.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
