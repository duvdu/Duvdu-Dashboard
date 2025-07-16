import { type Permission, type PermissionResource } from "@/types/rbac";

export const PERMISSION_KEYS = {
  DASHBOARD: {
    VIEW: "view-dashboard",
  },
  USERS: {
    VIEW: "list-users",
    CREATE: "create-user",
    UPDATE: "update-user",
    DELETE: "remove-user",
    BLOCK: "block-user",
    UNBLOCK: "unblock-user",
  },
  ADMINS: {
    VIEW: "list-users",
    CREATE: "create-user",
    UPDATE: "update-user",
    DELETE: "remove-user",
    BLOCK: "block-user",
    UNBLOCK: "unblock-user",
  },
  PROJECTS: {
    VIEW: "list-projects",
    CREATE: "create-project",
    UPDATE: "update-project",
    DELETE: "remove-project",
    APPROVE: "approve-project",
    REJECT: "reject-project",
    PAUSE: "pause-project",
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
  },
  MESSAGES: {
    FROM_TO: "list-messages-from-to",
    SEND: "send-message",
    DELETE: "delete-message",
  },

  NOTIFICATIONS: {
    VIEW: "list-notifications",
    SEND: "send-notification-to-users",
    DELETE: "remove-notification",
  },
} as const;

export const RESOURCES = {
  DASHBOARD: "dashboard",
  USERS: "users",
  ADMINS: "admins",
  PROJECTS: "projects",
  CATEGORIES: "categories",
  ROLES: "roles",
  MESSAGES: "messages",
  NOTIFICATIONS: "notifications",
  TERMS_AND_CONDITIONS: "terms_and_conditions",
  PERMISSIONS: "permissions",
  INVESTOR_SEGMENTATIONS: "investor_segmentations",
  INVESTOR_QUESTIONS: "investor_questions",
  INDIVIDUAL_INVESTORS: "individual_investors",
  INSTITUTIONAL_INVESTORS: "institutional_investors",
  PARTNERS: "partners",
  SUPPLIERS: "suppliers",
  OPPORTUNITIES: "opportunities",
  ROLES_PERMISSIONS: "roles_permissions",
  INDUSTRIES: "industries",
} as const;

export const ACTIONS = {
  VIEW: "view",
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  BLOCK: "block",
  UNBLOCK: "unblock",
  APPROVE: "approve",
  REJECT: "reject",
  PAUSE: "pause",
  SEND: "send",
  MANAGE: "manage",
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

// Utility to generate grouped permissions for forms (auto, lowerCamelCase keys)
export function getGroupedPermissionsForForm() {
  return Object.entries(PERMISSION_KEYS).reduce((acc, [key, value]) => {
    // Convert key to lowerCamelCase (e.g., PROJECTS -> projects, CATEGORIES -> categories)
    const groupKey = key.charAt(0).toLowerCase() + key.slice(1).toLowerCase();
    acc[groupKey] = Object.values(value);
    return acc;
  }, {} as Record<string, string[]>);
}
