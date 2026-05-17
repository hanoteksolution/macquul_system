import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../components/AdminLayout';
import { usePermissions } from '../contexts/PermissionContext';
import { PermissionGuard, withPermissions } from '../components/PermissionGuard';
import { 
  UserGroupIcon, 
  ShieldCheckIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  UserIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import { useNotify } from '../contexts/NotifyContext';

function PermissionsPage() {
  const router = useRouter();
  const { toast, confirm } = useNotify();
  const {
    permissions,
    roles,
    userPermissions,
    loading,
    createRole,
    updateRole,
    deleteRole,
    updateUserPermissions,
    getUserPermissions,
    getPermissionsByCategory
  } = usePermissions();

  const [activeTab, setActiveTab] = useState('roles');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showUserPermissionModal, setShowUserPermissionModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [editingUserPermission, setEditingUserPermission] = useState(null);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permission_ids: []
  });

  const permissionsByCategory = getPermissionsByCategory();

  const handleCreateRole = async () => {
    try {
      await createRole(newRole);
      setShowRoleModal(false);
      setNewRole({ name: '', description: '', permission_ids: [] });
      toast.success('Role created successfully!');
    } catch (error) {
      toast.error('Failed to create role. Please try again.');
    }
  };

  const handleUpdateRole = async () => {
    try {
      await updateRole(editingRole.id, {
        name: editingRole.name,
        description: editingRole.description,
        permission_ids: editingRole.permission_ids || editingRole.permissions?.map(p => p.id) || []
      });
      setEditingRole(null);
      toast.success('Role updated successfully!');
    } catch (error) {
      toast.error('Failed to update role. Please try again.');
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (await confirm('Are you sure you want to delete this role?', {
      title: 'Delete role',
      destructive: true,
      confirmLabel: 'Delete',
    })) {
      try {
        await deleteRole(roleId);
        toast.success('Role deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete role. Please try again.');
      }
    }
  };

  const handleEditUserPermissions = async (userPermission) => {
    try {
      const fullUserPermission = await getUserPermissions(userPermission.user);
      setEditingUserPermission({
        ...fullUserPermission,
        additional_permission_ids: fullUserPermission.additional_permissions?.map(p => p.id) || []
      });
      setShowUserPermissionModal(true);
    } catch (error) {
      toast.error('Failed to load user permissions.');
    }
  };

  const handleUpdateUserPermissions = async () => {
    try {
      await updateUserPermissions(editingUserPermission.user, {
        role_id: editingUserPermission.role?.id || null,
        additional_permission_ids: editingUserPermission.additional_permission_ids || []
      });
      setShowUserPermissionModal(false);
      setEditingUserPermission(null);
      toast.success('User permissions updated successfully!');
    } catch (error) {
      toast.error('Failed to update user permissions. Please try again.');
    }
  };

  const renderRolesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Role Management</h3>
        <PermissionGuard permission="manage_roles">
          <button
            onClick={() => setShowRoleModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Create Role
          </button>
        </PermissionGuard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  role.name === 'Super Admin' ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300' :
                  role.name === 'Admin' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' :
                  role.name === 'Manager' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' :
                  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  <UserGroupIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{role.name}</h4>
                  {role.is_default && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </div>
              </div>
              <PermissionGuard permission="manage_roles">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingRole(role)}
                    className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role.id)}
                    className="p-1 text-red-600 hover:text-red-800 dark:text-red-400"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </PermissionGuard>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{role.description}</p>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                {role.permissions?.length || 0} permissions
              </span>
              <ShieldCheckIcon className="h-4 w-4 text-green-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUserPermissionsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Permissions</h3>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {userPermissions.map((userPerm) => (
                <tr key={userPerm.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                        <UserIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{userPerm.username}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{userPerm.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      userPerm.role_name === 'Super Admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      userPerm.role_name === 'Admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      userPerm.role_name === 'Manager' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      userPerm.role_name ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {userPerm.role_name || 'No Role'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <KeyIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {userPerm.permission_count} permissions
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <PermissionGuard permission="manage_user_permissions">
                      <button
                        onClick={() => handleEditUserPermissions(userPerm)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm font-medium"
                      >
                        Edit Permissions
                      </button>
                    </PermissionGuard>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Permission Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage roles and user permissions</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('roles')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'roles'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Roles
            </button>
            <button
              onClick={() => setActiveTab('user-permissions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'user-permissions'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              User Permissions
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'roles' && renderRolesTab()}
        {activeTab === 'user-permissions' && renderUserPermissionsTab()}

        {/* Role Creation/Edit Modal */}
        {(showRoleModal || editingRole) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {editingRole ? 'Edit Role' : 'Create New Role'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role Name</label>
                  <input
                    type="text"
                    value={editingRole ? editingRole.name : newRole.name}
                    onChange={(e) => editingRole 
                      ? setEditingRole({...editingRole, name: e.target.value})
                      : setNewRole({...newRole, name: e.target.value})
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <textarea
                    value={editingRole ? editingRole.description : newRole.description}
                    onChange={(e) => editingRole 
                      ? setEditingRole({...editingRole, description: e.target.value})
                      : setNewRole({...newRole, description: e.target.value})
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Permissions</label>
                  <div className="space-y-4 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
                      <div key={category}>
                        <h4 className="font-medium text-gray-900 dark:text-white capitalize mb-2">{category}</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {categoryPermissions.map((permission) => {
                            const isSelected = editingRole 
                              ? (editingRole.permission_ids || editingRole.permissions?.map(p => p.id) || []).includes(permission.id)
                              : newRole.permission_ids.includes(permission.id);
                            
                            return (
                              <label key={permission.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (editingRole) {
                                      const currentIds = editingRole.permission_ids || editingRole.permissions?.map(p => p.id) || [];
                                      const newIds = e.target.checked 
                                        ? [...currentIds, permission.id]
                                        : currentIds.filter(id => id !== permission.id);
                                      setEditingRole({...editingRole, permission_ids: newIds});
                                    } else {
                                      const newIds = e.target.checked 
                                        ? [...newRole.permission_ids, permission.id]
                                        : newRole.permission_ids.filter(id => id !== permission.id);
                                      setNewRole({...newRole, permission_ids: newIds});
                                    }
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{permission.name}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowRoleModal(false);
                    setEditingRole(null);
                    setNewRole({ name: '', description: '', permission_ids: [] });
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={editingRole ? handleUpdateRole : handleCreateRole}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingRole ? 'Update Role' : 'Create Role'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Permission Edit Modal */}
        {showUserPermissionModal && editingUserPermission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Edit Permissions: {editingUserPermission.user_username}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                  <select
                    value={editingUserPermission.role?.id || ''}
                    onChange={(e) => {
                      const roleId = e.target.value ? parseInt(e.target.value) : null;
                      const role = roleId ? roles.find(r => r.id === roleId) : null;
                      setEditingUserPermission({...editingUserPermission, role});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">No Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Permissions</label>
                  <div className="space-y-4 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
                      <div key={category}>
                        <h4 className="font-medium text-gray-900 dark:text-white capitalize mb-2">{category}</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {categoryPermissions.map((permission) => {
                            const isSelected = editingUserPermission.additional_permission_ids.includes(permission.id);
                            
                            return (
                              <label key={permission.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const newIds = e.target.checked 
                                      ? [...editingUserPermission.additional_permission_ids, permission.id]
                                      : editingUserPermission.additional_permission_ids.filter(id => id !== permission.id);
                                    setEditingUserPermission({...editingUserPermission, additional_permission_ids: newIds});
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{permission.name}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowUserPermissionModal(false);
                    setEditingUserPermission(null);
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUserPermissions}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Permissions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// Protect the page with permissions
export default withPermissions(PermissionsPage, ['view_roles'], false);
