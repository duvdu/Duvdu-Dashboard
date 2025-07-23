import axios from "@/lib/axios";
import type { FundTransaction } from "../types/fund-transaction.types";

// List fund-transactions
export const getFundTransactions = async (filters: {
  user?: string;
  page?: number;
  limit?: number;
  status?: string;
  fundAmountFrom?: number;
  fundAmountTo?: number;
  createdAtFrom?: string;
  createdAtTo?: string;
}) => {
  const { data } = await axios.get("/api/payment/funding-transactions/crm", {
    params: filters,
  });
  return data as { data: FundTransaction[]; pagination: Pagination };
};

// Get fund-transaction by ID
export const getFundTransactionById = async (id: string) => {
  const { data } = await axios.get(
    `/api/payment/funding-transactions/crm/${id}`
  );
  return data?.data as FundTransaction;
};

// Create fund-transaction
export const createFundTransaction = async (formData: FormData) => {
  const { data } = await axios.post(
    "/api/payment/funding-transactions/crm",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
};
