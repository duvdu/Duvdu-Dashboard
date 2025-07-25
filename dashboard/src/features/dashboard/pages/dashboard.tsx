import DashboardLayout from "@/components/layout/DashboardLayout";
import { getUserCrmAnalysis } from "../api/dashboard.api";
import { ProjectStatsSection } from "../components/ProjectStatsSection";
import { UserStatsSection } from "../components/UserStatsSection";
import { ContractStatsSection } from "../components/ContractStatsSection";
import { useQuery } from "@tanstack/react-query";
import DashboardLoader from "@/components/layout/DashboardLoader";

const DashboardPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-crm-analysis"],
    queryFn: getUserCrmAnalysis,
  });

  if (isLoading) return <DashboardLoader />;
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {error && <div className="text-red-500">Failed to load dashboard</div>}
        {data && (
          <>
            {" "}
            <h2 className="text-xl font-semibold mb-2 mt-4 text-foreground">
              User Stats
            </h2>
            <UserStatsSection
              userStats={data.userStats}
              topUsers={data.topUsers}
            />
            <h2 className="text-xl font-semibold mb-2 mt-4 text-foreground">
              Top Users
            </h2>
            <h2 className="text-xl font-semibold mb-2 mt-4 text-foreground">
              Key Metrics
            </h2>
            <ProjectStatsSection projectStats={data.projectStats} />
            <h2 className="text-xl font-semibold mb-2 mt-4 text-foreground">
              Contract Stats
            </h2>
            <ContractStatsSection contractStats={data.contractStats} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
