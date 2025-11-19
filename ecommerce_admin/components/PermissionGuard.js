import React from 'react';
import { usePermissions } from '../contexts/PermissionContext';

/**
 * PermissionGuard component - conditionally renders children based on permissions
 * 
 * Usage examples:
 * <PermissionGuard permission="edit_users">
 *   <EditUserButton />
 * </PermissionGuard>
 * 
 * <PermissionGuard permissions={["create_products", "edit_products"]} requireAll={true}>
 *   <ProductForm />
 * </PermissionGuard>
 * 
 * <PermissionGuard permissions={["view_orders", "view_products"]} requireAll={false}>
 *   <DashboardWidget />
 * </PermissionGuard>
 */
export const PermissionGuard = ({ 
  children, 
  permission, 
  permissions = [], 
  requireAll = true,
  fallback = null,
  showLoading = false 
}) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission, loading } = usePermissions();

  // Show loading state if requested
  if (loading && showLoading) {
    return <div className="animate-pulse bg-gray-200 rounded h-4 w-20"></div>;
  }

  // Single permission check
  if (permission) {
    return hasPermission(permission) ? children : fallback;
  }

  // Multiple permissions check
  if (permissions.length > 0) {
    const hasRequiredPermissions = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
    
    return hasRequiredPermissions ? children : fallback;
  }

  // No permissions specified, render children
  return children;
};

/**
 * Hook for conditional logic based on permissions
 */
export const usePermissionCheck = () => {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissions();

  const canAccess = (permission) => hasPermission(permission);
  
  const canAccessAll = (permissions) => hasAllPermissions(permissions);
  
  const canAccessAny = (permissions) => hasAnyPermission(permissions);

  return {
    canAccess,
    canAccessAll,
    canAccessAny
  };
};

/**
 * Higher-order component for permission-based page protection
 */
export const withPermissions = (WrappedComponent, requiredPermissions = [], requireAll = true) => {
  return function PermissionProtectedComponent(props) {
    const { hasAllPermissions, hasAnyPermission, loading } = usePermissions();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    const hasRequiredPermissions = requireAll 
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasRequiredPermissions) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};
