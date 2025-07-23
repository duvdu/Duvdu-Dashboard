import type { Permission } from "@/types/rbac";

export interface Role {
  _id: string;
  key: string;
  permissions: Permission[];
  createdAt: string;
  system: boolean;
  updatedAt: string;
}

export interface RoleForm {
  key: string;
  permissions: Permission[];
}

export interface RoleResponse {
  data: Role;
}

export interface RolesListResponse {
  data: Role[];
}
