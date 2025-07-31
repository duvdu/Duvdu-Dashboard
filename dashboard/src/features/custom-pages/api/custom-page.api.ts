import axios from "@/lib/axios";
import type { CustomPageSchema } from "../schemas/custom-page.schema";
import type { CustomPage } from "../types/custom-page.types";

// List custom-pages
export const getCustomPages = async (filters: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { data } = await axios.get("/api/users/pages/crm", { params: filters });
  return data as { data: CustomPage[]; pagination: Pagination };
};

// Get custom-page by ID
export const getCustomPageById = async (id: string) => {
  const { data } = await axios.get(`/api/users/pages/crm/${id}`);
  return data?.data as CustomPage;
};

// Create custom-page
export const createCustomPage = async (values: {
  title: { en: string; ar: string };
  content: { en: string; ar: string };
  type: string;
}) => {
  const { data } = await axios.post("/api/users/pages/crm", values);
  return data;
};

// Update custom-page
export const updateCustomPage = async (
  id: string,
  values: CustomPageSchema
) => {
  const { data } = await axios.put(`/api/users/pages/crm/${id}`, values);
  return data;
};

// Delete custom-page
export const deleteCustomPage = async (id: string) => {
  const { data } = await axios.delete(`/api/users/pages/crm/${id}`);
  return data;
};
