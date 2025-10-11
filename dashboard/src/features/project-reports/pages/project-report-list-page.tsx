import DashboardLayout from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { type FilterDefinition } from "@/components/ui/filters";
import { UserSearchSelect } from "@/features/chat";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getProjectReports } from "../api/project-report.api";
import { useProjectReportColumns } from "../columns/project-report-columns";

export default function ProjectReportListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = +searchParams.get("page") || 1;
  const limit = +searchParams.get("limit") || 10;
  const sourceUser = searchParams.get("sourceUser") || "";
  const project = searchParams.get("project") || "";
  const closedBy = searchParams.get("closedBy") || "";
  const isClosed = searchParams.get("isClosed") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const feedback = searchParams.get("feedback") || "";

  const filters = {
    search,
    page,
    limit,
    sourceUser: sourceUser || undefined,
    // project: project || undefined,
    // closedBy: closedBy || undefined,
    // isClosed: isClosed || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    feedback: feedback || undefined,
  };

  const {
    data: reportsData,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["project-reports", filters],
    queryFn: () => getProjectReports(filters),
  });

  // const { data: projectsData } = useQuery({
  //   queryKey: ["projects"],
  //   queryFn: () => getProjects({ page: 1, limit: 1000 }),
  // });
  // const projects = projectsData?.data || [];

  const reports = reportsData?.data || [];
  const pagesCount = reportsData?.pagination.totalPages || 0;
  const totalCount = reportsData?.pagination.resultCount || 0;
  const columns = useProjectReportColumns(refetch);

  // Only user, project, and search filters
  const filterDefinitions: FilterDefinition[] = [
    {
      key: "sourceUser",
      label: "Source User",
      type: "custom",
      customComponent: (
        <UserSearchSelect
          onSelectUser={(user) => {
            setSearchParams({ sourceUser: user._id });
          }}
          selectedUserId={sourceUser}
        />
      ),
    },
    // {
    //   key: "project",
    //   label: "Project",
    //   type: "select",
    //   options: projects.map((project) => ({
    //     label: project.name,
    //     value: project._id,
    //   })),
    //   placeholder: "Select Project",
    // },
    // {
    //   key: "closedBy",
    //   label: "Closed By",
    //   type: "custom",
    //   customComponent: (
    //     <UserSearchSelect
    //       onSelectUser={(user) => {
    //         setSearchParams({ closedBy: user._id });
    //       }}
    //     />
    //   ),
    // },
    {
      key: "startDate",
      label: "Start Date",
      placeholder: "Select from date",
      type: "date",
    },

    {
      key: "endDate",
      label: "End Date",
      placeholder: "Select to date",
      type: "date",
    },
    // {
    //   key: "isClosed",
    //   label: "Is Closed",
    //   type: "select",
    //   options: [
    //     { label: "Yes", value: "true" },
    //     { label: "No", value: "false" },
    //   ],
    // },
  ];

  const filterValues = {
    sourceUser,
    project,
    closedBy,
    isClosed,
    startDate,
    endDate,
    feedback,
  };

  const handleFiltersChange = (vals: Record<string, unknown>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(vals).forEach(([key, value]) => {
      if (value && value !== "") {
        newParams.set(key, value as string);
      } else {
        newParams.delete(key);
      }
    });
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  return (
    <DashboardLayout className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Project Reports</h1>
        <div className="text-sm text-muted-foreground">
          Total: {totalCount} reports
        </div>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <DataTable
        columns={columns}
        data={reports}
        loading={loading}
        pagesCount={pagesCount}
        page={page}
        limit={limit}
        filters={filterDefinitions}
        filterValues={filterValues}
        onFiltersChange={handleFiltersChange}
      />
    </DashboardLayout>
  );
}
