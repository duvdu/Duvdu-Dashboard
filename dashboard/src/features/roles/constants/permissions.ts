// Re-export grouped permissions utility from config/permissions
export { getGroupedPermissionsForForm } from "@/config/permissions";

export type PermissionGroup = keyof ReturnType<
  typeof getGroupedPermissionsForForm
>;
export type Permission = string;
