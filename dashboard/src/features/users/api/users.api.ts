import api from "@/lib/axios";
import type { User } from "../types/user.types";

export async function getUsers({
  search = "",
  page = 1,
  limit = 10,
  status = "",
  isBlocked,
  isAdmin = false,
  isDeleted,
  from,
  to,
  role,
}: {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  isBlocked?: boolean;
  isAdmin?: boolean;
  isDeleted?: boolean;
  from?: string;
  to?: string;
  role?: string;
}) {
  const params = {
    search,
    page,
    limit,
    status,
    isBlocked,
    isAdmin,
    isDeleted,
    from,
    to,
    role,
  };
  const { data } = await api.get("api/users/auth/crm", { params });
  return data as PaginatedResponse<User>;
}

export async function createUser(user) {
  const { data } = await api.post("/api/users/auth/crm", user);
  return data;
}

export async function getUserById(id: string) {
  const { data } = await api.get(`/api/users/auth/crm/${id}`);
  return data?.data as User;
}

export async function updateUser(id, user) {
  const { data } = await api.patch(`/api/users/auth/crm/${id}`, user);
  return data;
}

export async function getUserWithdrawMethods(params) {
  const { data } = await api.get("/api/users/withdraw/crm", { params });
  return data;
}

export async function getUserWithdrawMethodById(id) {
  const { data } = await api.get(`/api/users/withdraw/crm/${id}`);
  return data;
}

export async function blockUser(userId: string, reason: string) {
  const { data } = await api.post(`/api/users/auth/crm/${userId}/block`, {
    reason,
  });
  return data;
}

export async function unblockUser(userId: string, reason?: string) {
  const { data } = await api.patch(`/api/users/auth/crm/${userId}/block`, {
    ...(reason && { reason }),
  });
  return data;
}

export async function deleteUser(userId: string) {
  const { data } = await api.delete(`/api/users/auth/crm/${userId}`);
  return data;
}

export const usersApi = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  getUserWithdrawMethods,
  getUserWithdrawMethodById,
  blockUser,
  unblockUser,
  deleteUser,
};
