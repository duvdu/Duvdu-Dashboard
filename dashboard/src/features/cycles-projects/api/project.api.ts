import axios from "@/lib/axios";
import type {
  Project,
  ProjectFilters,
  ProjectsResponse,
} from "../types/project.types";

// List projects
export const getProjects = async (
  filters: ProjectFilters
): Promise<ProjectsResponse> => {
  const { data } = await axios.get("/api/projects/crm", {
    params: Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== undefined && value !== ""
      )
    ),
  });
  return data;
};

// Get project by ID
export const getProjectById = async (id: string): Promise<Project> => {
  const { data } = await axios.get(`/api/projects/crm/${id}`);
  return data.data as Project;
};

// Update project
export const updateProject = async (
  id: string,
  data: any
): Promise<Project> => {
  const { data: res } = await axios.patch(`/api/projects/crm/${id}`, data);
  return res.data;
};

// Approve project
export const approveProject = async (
  id: string,
  reason?: string
): Promise<void> => {
  await axios.patch(`/api/projects/crm/${id}/approve`, { reason });
};

// Reject project
export const rejectProject = async (
  id: string,
  reason?: string
): Promise<void> => {
  await axios.patch(`/api/projects/crm/${id}/reject`, { reason });
};

// Pause project
export const pauseProject = async (
  id: string,
  reason?: string
): Promise<void> => {
  await axios.patch(`/api/projects/crm/${id}/pause`, { reason });
};

// Delete project
export const deleteProject = async (id: string): Promise<void> => {
  await axios.delete(`/api/projects/crm/${id}`);
};

// Update project status
export const updateProjectStatus = async (
  id: string,
  status: string,
  reason?: string
): Promise<void> => {
  await axios.patch(`/api/projects/crm/${id}/status`, { status, reason });
};

// Get project public view URL
export const getProjectPublicUrl = (id: string): string => {
  return `${import.meta.env.VITE_WEBSITE_URL}/project/${id}`;
};

// Get project history/logs
export const getProjectHistory = async (id: string) => {
  const { data } = await axios.get(`/api/projects/crm/${id}/history`);
  return data.data;
};
