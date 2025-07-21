import axios from "@/lib/axios";
import type { ContractReview } from "../types/types/contract-reviews.types";

// List project-reviews
export const getContractReviews = async (filters: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { data } = await axios.get("api/analysis/contract-review/crm", {
    params: filters,
  });
  return data as { data: ContractReview[]; pagination: Pagination };
};

// Get project-review by ID
export const getContractReviewById = async (id: string) => {
  const { data } = await axios.get(`api/analysis/contract-review/crm/${id}`);
  return data?.data as ContractReview;
};

// Delete project-review
export const deleteContractReview = async (id: string) => {
  const { data } = await axios.delete(`api/analysis/contract-review/crm/${id}`);
  return data;
};
