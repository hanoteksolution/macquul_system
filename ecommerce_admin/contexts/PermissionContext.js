import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const PermissionContext = createContext();

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [myPermissions, setMyPermissions] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load all available permissions
  const loadPermissions = async () => {
    try {
      const response = await api.get('/permissions/permissions/');
      setPermissions(response.data);
    } catch (error) {
      console.error('Failed to load permissions:', error);
    }
  };

  // Load all available roles
  const loadRoles = async () => {
    try {
      const response = await api.get('/permissions/roles/');
      setRoles(response.data);
    } catch (error) {
      console.error('Failed to load roles:', error);
    }
  };

  // Load user permissions
  const loadUserPermissions = async () => {
    try {
      const response = await api.get('/permissions/user-permissions/');
      setUserPermissions(response.data);
    } catch (error) {
      console.error('Failed to load user permissions:', error);
    }
  };

  // Load current user's permissions
  const loadMyPermissions = async () => {
    try {
      const response = await api.get('/permissions/my-permissions/');
      setMyPermissions(response.data);
    } catch (error) {
      console.error('Failed to load my permissions:', error);
      setMyPermissions({ all_permissions: [] });
    }
  };

  // Check if current user has a specific permission
  const hasPermission = (permissionCode) => {
    if (!myPermissions || !myPermissions.all_permissions) return false;
    return myPermissions.all_permissions.some(perm => perm.code === permissionCode);
  };

  // Check multiple permissions (user must have ALL of them)
  const hasAllPermissions = (permissionCodes) => {
    return permissionCodes.every(code => hasPermission(code));
  };

  // Check multiple permissions (user must have ANY of them)
  const hasAnyPermission = (permissionCodes) => {
    return permissionCodes.some(code => hasPermission(code));
  };

  // Create a new role
  const createRole = async (roleData) => {
    try {
      const response = await api.post('/permissions/roles/', roleData);
      await loadRoles();
      return response.data;
    } catch (error) {
      console.error('Failed to create role:', error);
      throw error;
    }
  };

  // Update a role
  const updateRole = async (roleId, roleData) => {
    try {
      const response = await api.put(`/permissions/roles/${roleId}/`, roleData);
      await loadRoles();
      return response.data;
    } catch (error) {
      console.error('Failed to update role:', error);
      throw error;
    }
  };

  // Delete a role
  const deleteRole = async (roleId) => {
    try {
      await api.delete(`/permissions/roles/${roleId}/`);
      await loadRoles();
    } catch (error) {
      console.error('Failed to delete role:', error);
      throw error;
    }
  };

  // Update user permissions
  const updateUserPermissions = async (userId, permissionData) => {
    try {
      const response = await api.put(`/permissions/user-permissions/${userId}/`, permissionData);
      await loadUserPermissions();
      return response.data;
    } catch (error) {
      console.error('Failed to update user permissions:', error);
      throw error;
    }
  };

  // Get user permissions by user ID
  const getUserPermissions = async (userId) => {
    try {
      const response = await api.get(`/permissions/user-permissions/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Failed to get user permissions:', error);
      throw error;
    }
  };

  // Load all data on mount
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([
        loadPermissions(),
        loadRoles(),
        loadUserPermissions(),
        loadMyPermissions()
      ]);
      setLoading(false);
    };

    loadAllData();
  }, []);

  // Group permissions by category
  const getPermissionsByCategory = () => {
    const grouped = {};
    permissions.forEach(permission => {
      if (!grouped[permission.category]) {
        grouped[permission.category] = [];
      }
      grouped[permission.category].push(permission);
    });
    return grouped;
  };

  const value = {
    // Data
    permissions,
    roles,
    userPermissions,
    myPermissions,
    loading,

    // Permission checking functions
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,

    // Data loading functions
    loadPermissions,
    loadRoles,
    loadUserPermissions,
    loadMyPermissions,

    // Role management functions
    createRole,
    updateRole,
    deleteRole,

    // User permission management functions
    updateUserPermissions,
    getUserPermissions,

    // Utility functions
    getPermissionsByCategory,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};
