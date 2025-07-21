import axios from "@/lib/axios";
import type {
  ProjectReport,
  ProjectReportsResponse,
} from "../types/project-report.types";

// List project-reports
export const getProjectReports = async (filters: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { data } = await axios.get("/api/users/report", {
    params: filters,
  });
  return data as ProjectReportsResponse;
};

// Get project-report by ID
export const getProjectReportById = async (id: string) => {
  const { data } = await axios.get(`/api/users/report/${id}`);
  return data?.data as ProjectReport;
};

// Delete project-report
export const deleteProjectReport = async (id: string) => {
  const { data } = await axios.delete(`/api/users/report/${id}`);
  return data;
};
