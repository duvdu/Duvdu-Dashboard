import DashboardLayout from "@/components/layout/DashboardLayout";
import { getUserCrmAnalysis } from "../api/dashboard.api";
import { ProjectStatsSection } from "../components/ProjectStatsSection";
import { UserStatsSection } from "../components/UserStatsSection";
import { ContractStatsSection } from "../components/ContractStatsSection";
import { useQuery } from "@tanstack/react-query";
import Filters, { type FilterDefinition } from "@/components/ui/filters";
import { useState } from "react";
import { type DashboardFilterSchema } from "../schemas/filter.schema";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";

const filterDefinitions: FilterDefinition[] = [
  {
    key: "interval",
    label: "Interval",
    type: "select",
    options: [
      { label: "Today", value: "today" },
      { label: "This Week", value: "week" },
      { label: "This Month", value: "month" },
      { label: "Custom", value: "custom" },
    ],
    placeholder: "Select interval",
  },
  {
    key: "from",
    label: "From",
    type: "date",
    placeholder: "From date",
  },
  {
    key: "to",
    label: "To",
    type: "date",
    placeholder: "To date",
  },
];

const DashboardPage = () => {
  const [filters, setFilters] = useState<Partial<DashboardFilterSchema>>({
    interval: "month",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["user-crm-analysis", filters],
    queryFn: () =>
      getUserCrmAnalysis({
        from: filters.from || undefined,
        to: filters.to || undefined,
        interval: filters.interval || undefined,
      }),
  });

  // Map user rank colors to theme variables for charts
  const rankColorMap = {
    Gold: "var(--chart-1)",
    Silver: "var(--chart-2)",
    Bronze: "var(--chart-3)",
    Platinum: "var(--chart-4)",
    Diamond: "var(--chart-5)",
  };
  const userStatsWithThemeColors = data
    ? {
        ...data.userStats,
        usersByRank: data.userStats.usersByRank.map((item, idx) => ({
          ...item,
          color: rankColorMap[item.rank] || `var(--chart-${(idx % 5) + 1})`, // fallback to theme color
        })),
      }
    : undefined;
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <Filters
          filters={filterDefinitions}
          values={filters}
          onChange={setFilters}
        />
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error.response?.data?.errors?.[0]?.message ||
                "Failed to load dashboard"}
            </AlertDescription>
          </Alert>
        )}
        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <Loader className="w-4 h-4 " />
          </div>
        )}
        {data && (
          <>
            {" "}
            <h2 className="text-xl font-semibold mb-2 mt-4 text-foreground">
              User Stats
            </h2>
            <UserStatsSection
              userStats={userStatsWithThemeColors}
              topUsers={data.topUsers}
            />
            <h2 className="text-xl font-semibold mb-2 mt-4 text-foreground">
              Project Metrics
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
