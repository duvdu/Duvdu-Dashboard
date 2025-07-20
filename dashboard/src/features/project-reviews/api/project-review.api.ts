import axios from "@/lib/axios";
import type { ProjectReview } from "../types/project-review.types";

// List project-reviews
export const getProjectReviews = async (filters: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { data } = await axios.get("api/analysis/project-review/crm", {
    params: filters,
  });
  return data as { data: ProjectReview[]; pagination: Pagination };
};

// Get project-review by ID
export const getProjectReviewById = async (id: string) => {
  const { data } = await axios.get(`/api/project-review/crm/${id}`);
  return data?.data as ProjectReview;
};

// Create project-review
export const createProjectReview = async (formData: FormData) => {
  const { data } = await axios.post("/api/project-review", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Update project-review
export const updateProjectReview = async (id: string, formData: FormData) => {
  const { data } = await axios.put(`/api/project-review/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Delete project-review
export const deleteProjectReview = async (id: string) => {
  const { data } = await axios.delete(`/api/project-review/${id}`);
  return data;
};
