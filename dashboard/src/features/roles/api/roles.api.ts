import axios from "../../../lib/axios";
import type {
  Role,
  RoleForm,
  RoleResponse,
  RolesListResponse,
} from "../types/role.types";

export const getRoles = async (): Promise<Role[]> => {
  const { data } = await axios.get<RolesListResponse>("/api/users/roles");
  return data.data;
};

export const getRole = async (id: string): Promise<Role> => {
  const { data } = await axios.get<RoleResponse>(`/api/users/roles/${id}`);
  return data.data;
};

export const createRole = async (role: RoleForm): Promise<Role> => {
  const { data } = await axios.post<RoleResponse>("/api/users/roles", role);
  return data.data;
};

export const updateRole = async (id: string, role: RoleForm): Promise<Role> => {
  const { data } = await axios.put<RoleResponse>(
    `/api/users/roles/${id}`,
    role
  );
  return data.data;
};

export const deleteRole = async (id: string): Promise<void> => {
  await axios.delete(`/api/users/roles/${id}`);
};
