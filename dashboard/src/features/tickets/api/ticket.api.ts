import axios from "@/lib/axios";
import type { Ticket } from "../types/ticket.types";

// List tickets
export const getTickets = async (filters: {
  search?: string;
  page?: number;
  limit?: number;
  isClosed?: boolean;
  startDate?: string;
  endDate?: string;
  reporter?: string;
}) => {
  const { data } = await axios.get("/api/users/tickets", { params: filters });
  return data as { data: Ticket[]; pagination: Pagination };
};

// Get ticket by ID
export const getTicketById = async (id: string) => {
  const { data } = await axios.get(`/api/users/tickets/${id}`);
  return data?.data as Ticket;
};

// Create ticket
export const createTicket = async (formData: FormData) => {
  const { data } = await axios.post("/api/ticket", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Update ticket
export const updateTicket = async (id: string, formData: FormData) => {
  const { data } = await axios.put(`/api/ticket/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Delete ticket
export const deleteTicket = async (id: string) => {
  const { data } = await axios.delete(`/api/users/tickets/${id}`);
  return data;
};

export const patchTicketFeedback = async (id: string, feedback: string) => {
  const { data } = await axios.put(`/api/users/tickets/${id}`, {
    state: { feedback },
  });
  return data;
};
