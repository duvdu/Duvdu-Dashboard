import axios from "@/lib/axios";
import type { CancelledContract } from "../types/cancelled-contract.types";

// List cancelled contracts
export const getCancelledContracts = async (filters: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  user?: string;
}) => {
  const { data } = await axios.get("/api/contracts/contractCancel", {
    params: filters,
  });
  return data as { data: CancelledContract[]; pagination: Pagination };
};

// Get cancelled contract by ID
export const getCancelledContractById = async (id: string) => {
  const { data } = await axios.get(`/api/contracts/contractCancel/${id}`);
  return data?.data as CancelledContract;
};

// Approve cancelled contract
export const approveCancelledContract = async (id: string) => {
  const { data } = await axios.patch(`/api/contracts/contractCancel/${id}`);
  return data;
};

// Reject cancelled contract
export const rejectCancelledContract = async (id: string) => {
  const { data } = await axios.delete(`/api/contracts/contractCancel/${id}`);
  return data;
};
