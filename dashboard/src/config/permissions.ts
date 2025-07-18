import { type Permission, type PermissionResource } from "@/types/rbac";

export const PERMISSION_KEYS = {
  // DASHBOARD: {
  //   VIEW: "view-dashboard",
  // },
  USERS: {
    VIEW: "list-users",
    CREATE: "create-user",
    UPDATE: "update-user",
    DELETE: "remove-user",
    BLOCK: "block-user",
    UNBLOCK: "un-block-user",
  },
  ADMINS: {
    VIEW: "list-users",
    CREATE: "create-user",
    UPDATE: "update-user",
    DELETE: "remove-user",
    BLOCK: "block-user",
    UNBLOCK: "un-block-user",
  },
  PROJECTS: {
    VIEW: "list-projects",
    UPDATE: "update-project",
    DELETE: "remove-project",
    PROJECT_ANALYSIS: "get-project-analysis",
  },
  CATEGORIES: {
    VIEW: "list-categories",
    CREATE: "create-category",
    UPDATE: "update-category",
    DELETE: "remove-category",
  },
  ROLES: {
    VIEW: "list-roles",
    CREATE: "create-role",
    UPDATE: "update-role",
    DELETE: "remove-role",
    PERMISSIONS: "get-all-permissions",
  },
  MESSAGES: {
    FROM_TO: "list-messages-from-to",
  },
  WITHDRAW_METHODS: {
    VIEW: "list-withdraw-methods",
    UPDATE: "update-withdraw-method",
  },
  CONTRACTS: {
    VIEW: "list-contracts",
    CREATE: "create-contract",
    UPDATE: "update-contract",
    DELETE: "remove-contract",
    LIST_CONTRACTS_ANALYSIS: "list-contracts-analysis",
    VIEW_CANCELED_CONTRACTS: "list-cancel-contracts",
    ACCEPT_CANCEL_CONTRACT: "accept-cancel-contract",
    DELETE_CANCEL_CONTRACT: "delete-cancel-contract",
  },
  COMPLAINTS: {
    VIEW: "list-complaints",
    UPDATE: "update-complaint",
    CLOSE: "close-complaint",
  },
  NOTIFICATIONS: {
    SEND: "send-notification-to-users",
  },
} as const;

export function hasPermission(
  permissions: Permission[],
  permissionKey: string
): boolean {
  return permissions.some((permission) => permission === permissionKey);
}

export function hasAnyPermission(
  permissions: Permission[],
  permissionKeys: string[]
): boolean {
  return permissionKeys.some((key) => hasPermission(permissions, key));
}

export function hasResource(
  permissions: Permission[],
  resource: PermissionResource
): boolean {
  return permissions.some((permission) => permission === resource);
}

export function canAccess(
  permissions: Permission[],
  requiredPermissions?: string[]
): boolean {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }
  return hasAnyPermission(permissions, requiredPermissions);
}

export function filterPermissionsByResource(
  permissions: Permission[],
  resource: PermissionResource
): Permission[] {
  return permissions.filter((permission) => permission === resource);
}

export function getPermissionsByRole(permissions: Permission[]): Permission[] {
  return permissions;
}

export function getGroupedPermissionsForForm() {
  return Object.entries(PERMISSION_KEYS).reduce((acc, [key, value]) => {
    const groupKey = key.charAt(0).toLowerCase() + key.slice(1).toLowerCase();
    acc[groupKey] = Object.values(value);
    return acc;
  }, {} as Record<string, string[]>);
}
