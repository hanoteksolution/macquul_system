from django.core.management.base import BaseCommand
from apps.permissions.models import Role, UserPermission
from apps.users.models import User


class Command(BaseCommand):
    help = 'Assign Super Admin role to all staff users'

    def handle(self, *args, **options):
        self.stdout.write('Assigning Super Admin role to staff users...')

        try:
            # Get the Super Admin role
            super_admin_role = Role.objects.get(name='Super Admin')
            self.stdout.write(f'Found Super Admin role with {super_admin_role.permissions.count()} permissions')

            # Get all staff users
            staff_users = User.objects.filter(is_staff=True)
            self.stdout.write(f'Found {staff_users.count()} staff users')

            for user in staff_users:
                # Create or update UserPermission
                user_permission, created = UserPermission.objects.get_or_create(
                    user=user,
                    defaults={'role': super_admin_role}
                )
                
                if not created:
                    # Update existing permission
                    user_permission.role = super_admin_role
                    user_permission.save()
                    action = 'Updated'
                else:
                    action = 'Created'
                
                self.stdout.write(f'{action} permissions for user: {user.username} ({user.email})')

            self.stdout.write(self.style.SUCCESS(f'Successfully assigned Super Admin role to {staff_users.count()} staff users!'))

        except Role.DoesNotExist:
            self.stdout.write(self.style.ERROR('Super Admin role not found. Please run setup_permissions first.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
