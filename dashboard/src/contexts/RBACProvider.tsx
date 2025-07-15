/* eslint-disable react-refresh/only-export-components */
import {
  canAccess,
  hasAnyPermission,
  hasPermission,
  hasResource,
} from "@/config/permissions";
import { getRoleConfig } from "@/config/roles";
import { useAuthStore } from "@/features/auth/store";
import { type Permission, type RBACContext, type UserRole } from "@/types/rbac";
import React, { createContext, useContext, useMemo } from "react";

const RBACContext = createContext<RBACContext | null>(null);

interface RBACProviderProps {
  children: React.ReactNode;
}

export function RBACProvider({ children }: RBACProviderProps) {
  const { user, permissions } = useAuthStore();

  const role = user?.role?.key as UserRole | null;

  const contextValue = useMemo<RBACContext>(
    () => ({
      role,
      permissions,
      hasPermission: (permissionKey: string) =>
        hasPermission(permissions, permissionKey),
      hasAnyPermission: (permissionKeys: string[]) =>
        hasAnyPermission(permissions, permissionKeys),
      hasResource: (resource) => hasResource(permissions, resource),
      canAccess: (requiredPermissions) =>
        canAccess(permissions, requiredPermissions),
    }),
    [role, permissions]
  );

  return (
    <RBACContext.Provider value={contextValue}>{children}</RBACContext.Provider>
  );
}

export function useRBAC(): RBACContext {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error("useRBAC must be used within an RBACProvider");
  }
  return context;
}

export function useRole(): UserRole | null {
  const rbac = useRBAC();
  return rbac.role;
}

export function usePermissions(): Permission[] {
  const { permissions } = useRBAC();
  return permissions;
}

export function useHasPermission(permissionKey: string): boolean {
  const { hasPermission } = useRBAC();
  return hasPermission(permissionKey);
}

export function useHasAnyPermission(permissionKeys: string[]): boolean {
  const { hasAnyPermission } = useRBAC();
  return hasAnyPermission(permissionKeys);
}

export function useCanAccess(requiredPermissions?: string[]): boolean {
  const { canAccess } = useRBAC();
  return canAccess(requiredPermissions);
}

export function useRoleConfig() {
  const role = useRole();
  const permissions = usePermissions();
  return role ? getRoleConfig(role, permissions) : null;
}

export function useRoleSidebar() {
  const roleConfig = useRoleConfig();
  return roleConfig?.sidebar || [];
}
