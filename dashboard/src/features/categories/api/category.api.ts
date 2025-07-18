import axios from "@/lib/axios";
import type { Category } from "../types/category.types";

declare global {
  type PaginatedResponse<T> = {
    data: T[];
    pagination: {
      currentPage: number;
      resultCount: number;
      totalPages: number;
    };
  };
}

// 1. Projects Uploaded
export const fetchProjectsUploaded = async (filters: any) => {
  const { startDate, endDate } = filters;
  const { data } = await axios.get("/api/projects/analysis", {
    params: { startDate, endDate },
  });
  console.log(data, "projects");
  return data?.data;
};

// 2. Top Users (Ranking)
export const fetchTopUsers = async (filters: any) => {
  const { startDate, endDate, userType } = filters;
  const { data } = await axios.get("/api/analysis/rank", {
    params: {
      startDate,
      endDate,
      role: userType !== "all" ? userType : undefined,
    },
  });
  return data?.data;
};

// 3. New Users
export const fetchNewUsers = async (filters: any) => {
  const { startDate, endDate, userType } = filters;
  const { data } = await axios.get("/api/users/auth/find", {
    params: {
      startDate,
      endDate,
      role: userType !== "all" ? userType : undefined,
    },
  });
  return data?.data;
};

// 4. Contracts Count
export const fetchContractsCount = async (filters: any) => {
  const { startDate, endDate } = filters;
  const { data } = await axios.get("/api/contracts/analysis", {
    params: { startDate, endDate },
  });
  return data?.data;
};

// 5. Open Disputes & Complaints
export const fetchComplaints = async () => {
  const { data } = await axios.get("/api/contracts/complaints");
  return data?.data;
};

// 6. Active Users Split & Live Users Online Now
// No direct endpoint found; placeholder for future implementation
export const fetchActiveUsersSplit = async () => {
  return { clients: 0, serviceProviders: 0 };
};
export const fetchLiveUsersOnline = async () => {
  return { clients: 0, serviceProviders: 0 };
};

// List categories
export const getCategories = async (filters: {
  search?: string;
  title?: string;
  cycle?: string;
  status?: string;
  page?: number;
  limit?: number;
  isRelated?: boolean;
}) => {
  const { data } = await axios.get("/api/category/crm", {
    params: Object.fromEntries(
      Object.entries(filters).filter(([, value]) => !!value)
    ),
  });
  return data as PaginatedResponse<Category>;
};

// Get category by ID
export const getCategoryById = async (id: string) => {
  const { data } = await axios.get(`/api/category/crm/${id}`);
  return data?.data as Category;
};

// Create category
export const createCategory = async (formData: FormData) => {
  const { data } = await axios.post("/api/category", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Update category
export const updateCategory = async (id: string, formData: FormData) => {
  const { data } = await axios.put(`/api/category/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Delete category
export const deleteCategory = async (id: string) => {
  const { data } = await axios.delete(`/api/category/${id}`);
  return data;
};
