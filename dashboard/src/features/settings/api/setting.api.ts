import axios from "@/lib/axios";
import type { Settings } from "../types/setting.types";

// List settings
export const getSettings = async (filters: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { data } = await axios.get("/api/analysis/setting", {
    params: filters,
  });
  return data?.data as Settings;
};

// Create setting
export const createSettings = async (formData: FormData) => {
  const { data } = await axios.post("/api/setting", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Update setting
export const updateSettings = async (id: string, formData: FormData) => {
  const { data } = await axios.put(`/api/analysis/setting/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Get settings by ID
export const getSettingsById = async (id: string) => {
  const { data } = await axios.get(`/api/analysis/setting/${id}`);
  return data?.data as Settings;
};

// Add expiration time
export const addExpirationTime = async (settingId: string, time: number) => {
  const { data } = await axios.post(`/api/analysis/setting/${settingId}`, {
    time,
  });
  return data;
};

// Update expiration time
export const updateExpirationTime = async (
  settingId: string,
  expirationId: string,
  time: number
) => {
  const { data } = await axios.patch(`/api/analysis/setting/${settingId}`, {
    expirationId,
    time,
  });
  return data;
};

// Delete expiration time
export const deleteExpirationTime = async (
  settingId: string,
  expirationId: string
) => {
  const { data } = await axios.delete(`/api/analysis/setting/${settingId}`, {
    data: { expirationId },
  });
  return data;
};
