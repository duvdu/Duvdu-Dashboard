import axios from "@/lib/axios";
import type {
  ContractListResponse,
  ContractRoot,
} from "../types/contract.types";

// List contracts
export const getContracts = async (filters: {
  user?: string;
  status?: string;
  type?: string;
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { data } = await axios.get("/api/contracts", { params: filters });
  return data as ContractListResponse;
};

// Get contract by ID
export const getContractById = async (id: string) => {
  const { data } = await axios.get(`/api/contracts/${id}`);
  return data?.data as ContractRoot;
};

// Create contract
export const createContract = async (formData: FormData) => {
  const { data } = await axios.post("/api/contract", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Update contract
export const updateContract = async (id: string, formData: FormData) => {
  const { data } = await axios.put(`/api/contract/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Delete contract
export const deleteContract = async (id: string) => {
  const { data } = await axios.delete(`/api/contract/${id}`);
  return data;
};
