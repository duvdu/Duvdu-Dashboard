import axios from "@/lib/axios";
import type { DashboardFilterSchema } from "../schemas/filter.schema";

// 1. Projects Uploaded
export const fetchProjectsUploaded = async (filters: DashboardFilterSchema) => {
  const { startDate, endDate } = filters;
  const { data } = await axios.get("/api/projects/analysis", {
    params: { startDate, endDate },
  });
  console.log(data, "projects");
  return data?.data;
};

// 2. Top Users (Ranking)
export const fetchTopUsers = async (filters: DashboardFilterSchema) => {
  const { startDate, endDate, userType } = filters;
  const { data } = await axios.get("/api/analysis/rank", {
    params: {
      startDate,
      endDate,
      role: userType !== "all" ? userType : undefined,
    },
  });
  return data?.data;
};

// 3. New Users
export const fetchNewUsers = async (filters: DashboardFilterSchema) => {
  const { startDate, endDate, userType } = filters;
  const { data } = await axios.get("/api/users/auth/find", {
    params: {
      startDate,
      endDate,
      role: userType !== "all" ? userType : undefined,
    },
  });
  return data?.data;
};

// 4. Contracts Count
export const fetchContractsCount = async (filters: DashboardFilterSchema) => {
  const { startDate, endDate } = filters;
  const { data } = await axios.get("/api/contracts/analysis", {
    params: { startDate, endDate },
  });
  return data?.data;
};

// 5. Open Disputes & Complaints
export const fetchComplaints = async () => {
  const { data } = await axios.get("/api/contracts/complaints");
  return data?.data;
};

// 6. Active Users Split & Live Users Online Now
// No direct endpoint found; placeholder for future implementation
export const fetchActiveUsersSplit = async () => {
  return { clients: 0, serviceProviders: 0 };
};
export const fetchLiveUsersOnline = async () => {
  return { clients: 0, serviceProviders: 0 };
};

export const getUserCrmAnalysis = async (filters: {
  from?: string;
  to?: string;
  interval?: string;
}) => {
  const { data } = await axios.get("/api/analysis/user/crm", {
    params: filters,
  });
  return data.data;
};
