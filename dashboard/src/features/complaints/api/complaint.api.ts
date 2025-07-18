import axios from "@/lib/axios";
import type { Complaint } from "../types/complaint.types";

// List complaints
export const getComplaints = async (filters: {
  search?: string;
  page?: number;
  limit?: number;
  isClosed?: string;
  startDate?: string;
  endDate?: string;
  reporter?: string;
}) => {
  const { data } = await axios.get("/api/contracts/complaints/crm", {
    params: filters,
  });
  return data;
};

// Get complaint by ID
export const getComplaintById = async (id: string) => {
  const { data } = await axios.get(`/api/contracts/complaints/crm/${id}`);
  return data?.data as Complaint;
};

// Create complaint
export const createComplaint = async (formData: FormData) => {
  const { data } = await axios.post("/api/complaint", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Update complaint
export const updateComplaint = async (id: string, formData: FormData) => {
  const { data } = await axios.put(`/api/complaint/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Delete complaint
export const deleteComplaint = async (id: string) => {
  const { data } = await axios.delete(`/api/complaint/${id}`);
  return data;
};

// Send feedback on a complaint
export const addComplaintFeedback = async (
  complaintId: string,
  feedback: string,
  sendNotification?: boolean
) => {
  const { data } = await axios.patch(
    `/api/contracts/complaints/crm/${complaintId}`,
    {
      feedback,
      ...(sendNotification !== undefined ? { sendNotification } : {}),
    }
  );
  return data;
};

// Close complaint with feedback
export const closeComplaintWithFeedback = async (
  complaintId: string,
  feedback?: string,
  sendNotification?: boolean
) => {
  const { data } = await axios.patch(
    `/api/contracts/complaints/crm/${complaintId}/close`,
    {
      ...(feedback ? { feedback } : {}),
      ...(sendNotification !== undefined ? { sendNotification } : {}),
    }
  );
  return data;
};
