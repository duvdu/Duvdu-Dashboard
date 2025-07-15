import DashboardLayout from "@/components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import {
  fetchActiveUsersSplit,
  fetchComplaints,
  fetchContractsCount,
  fetchLiveUsersOnline,
  fetchNewUsers,
  fetchProjectsUploaded,
  fetchTopUsers,
} from "../api/dashboard.api";
import { FilterBar } from "../components/FilterBar";
import { KPIGroup } from "../components/KPIGroup";
import type { DashboardFilterSchema } from "../schemas/filter.schema";
import type { DashboardKPIResponse } from "../types/kpi.types";

const DashboardPage = () => {
  const [filters, setFilters] = useState<DashboardFilterSchema>({
    userType: "all",
  });
  const [data, setData] = useState<DashboardKPIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadKPIs = async (f: DashboardFilterSchema) => {
    setLoading(true);
    setError(null);
    try {
      const [
        projectsUploaded,
        topUsers,
        newUsers,
        contractsCount,
        openDisputesComplaints,
        activeUsersSplit,
        liveUsersOnline,
      ] = await Promise.all([
        fetchProjectsUploaded(f),
        fetchTopUsers(f),
        fetchNewUsers(f),
        fetchContractsCount(f),
        fetchComplaints(),
        fetchActiveUsersSplit(),
        fetchLiveUsersOnline(),
      ]);
      // Compose the DashboardKPIResponse object
      setData({
        projectsUploaded: { count: projectsUploaded.totalCount ?? 0 },
        topUsers: Array.isArray(topUsers) ? topUsers : [],
        activeUsersSplit,
        liveUsersOnline,
        newUsers: { count: Array.isArray(newUsers) ? newUsers.length : 0 },
        openDisputesComplaints: {
          disputes: Array.isArray(openDisputesComplaints)
            ? (openDisputesComplaints as { type: string }[]).filter(
                (c) => c.type === "dispute"
              ).length
            : 0,
          complaints: Array.isArray(openDisputesComplaints)
            ? (openDisputesComplaints as { type: string }[]).filter(
                (c) => c.type === "complaint"
              ).length
            : 0,
        },
        contractsCount: {
          closed: contractsCount?.closed ?? 0,
          pending: contractsCount?.pending ?? 0,
          cancelled: contractsCount?.cancelled ?? 0,
        },
      });
    } catch (err) {
      console.log(err);
      setError("Failed to load dashboard KPIs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKPIs(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <FilterBar onFilter={setFilters} defaultValues={filters} />
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {data && <KPIGroup data={data} />}
    </DashboardLayout>
  );
};

export default DashboardPage;
