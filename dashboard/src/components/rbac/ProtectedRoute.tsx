import { PageLoader } from "@/components/ui/page-loader";
import { useRBAC } from "@/contexts/RBACProvider";
import { useAuthStore } from "@/features/auth/store";
import { type PermissionAction, type PermissionResource } from "@/types/rbac";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;

  // Permission-based access control
  permissionKey?: string;
  permissionKeys?: string[];

  // Resource-based access control
  resource?: PermissionResource;
  action?: PermissionAction;

  // Role-based access control
  roles?: string[];

  // Redirect path when access is denied
  redirectTo?: string;

  // Whether to require all permissions or just one
  requireAll?: boolean;
}

export function ProtectedRoute({
  children,
  permissionKey,
  permissionKeys,
  resource,
  action,
  roles,
  redirectTo = "/dashboard/not-allowed",
  requireAll = false,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isLoading, error, fetchProfile, isAuthenticated } = useAuthStore();
  const { role, hasPermission, hasAnyPermission, hasResource } = useRBAC();

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Show loading state while fetching profile
  if (isLoading) {
    return <PageLoader />;
  }

  // Redirect to login if there's an authentication error
  if (error && !isLoading) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (roles && roles.length > 0) {
    if (!role || !roles.includes(role)) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  // Check single permission
  if (permissionKey) {
    if (!hasPermission(permissionKey)) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  // Check multiple permissions
  if (permissionKeys && permissionKeys.length > 0) {
    const hasAccess = requireAll
      ? permissionKeys.every((key) => hasPermission(key))
      : hasAnyPermission(permissionKeys);

    if (!hasAccess) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  // Check resource-based permission
  if (resource && action) {
    if (!hasResource(resource, action)) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  return <>{children}</>;
}
