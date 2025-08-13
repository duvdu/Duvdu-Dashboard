import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import type { FilterDefinition } from "@/components/ui/filters";
import { UserSearchSelect } from "@/features/chat";
import { getProjectReports } from "@/features/project-reports/api/project-report.api";
import { useProjectReportColumns } from "@/features/project-reports/columns/project-report-columns";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

function ProjectReportsPanel({ id }: { id: string }) {
  const [reportSearchParams, setReportSearchParams] = useSearchParams();
  const reportPage = +reportSearchParams.get("reportPage") || 1;
  const reportLimit = +reportSearchParams.get("reportLimit") || 10;
  const sourceUser = reportSearchParams.get("sourceUser") || "";
  const startDate = reportSearchParams.get("startDate") || "";
  const endDate = reportSearchParams.get("endDate") || "";
  const feedback = reportSearchParams.get("feedback") || "";
  const closedBy = reportSearchParams.get("closedBy") || "";
  const isClosed = reportSearchParams.get("isClosed") || "";

  const reportFilters = {
    page: reportPage,
    limit: reportLimit,
    sourceUser: sourceUser || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    closedBy: closedBy || undefined,
    isClosed: isClosed || undefined,
    // project: id,
  };

  const {
    data: reportsData,
    isLoading: reportsLoading,
    error: reportsError,
    refetch: refetchReports,
  } = useQuery({
    queryKey: ["project-reports", reportFilters],
    queryFn: () => getProjectReports(reportFilters),
    enabled: !!id,
  });

  const reportsColumns = useProjectReportColumns(refetchReports);
  const reportsPagesCount = reportsData?.pagination.totalPages || 0;
  const reportsTotalCount = reportsData?.pagination.resultCount || 0;

  const reportsFilterDefinitions: FilterDefinition[] = [
    {
      key: "sourceUser",
      label: "Source User",
      placeholder: "Select Reported By",
      type: "custom",
      customComponent: (
        <UserSearchSelect
          placeholder="Select Reported By"
          selectedUserId={sourceUser}
          onSelectUser={(user) => {
            if (user) {
              setReportSearchParams({ sourceUser: user._id });
            } else {
              setReportSearchParams({ sourceUser: "" });
            }
          }}
        />
      ),
    },
    {
      key: "closedBy",
      label: "Closed By",
      placeholder: "Select Closed By",
      type: "custom",
      customComponent: (
        <UserSearchSelect
          placeholder="Select Closed By"
          selectedUserId={closedBy}
          onSelectUser={(user) => {
            if (user) {
              setReportSearchParams({ closedBy: user._id });
            } else {
              setReportSearchParams({ closedBy: "" });
            }
          }}
        />
      ),
    },
    {
      key: "startDate",
      label: "Start Date",
      type: "date",
    },
    {
      key: "endDate",
      label: "End Date",
      type: "date",
    },
    {
      key: "isClosed",
      label: "Status",
      placeholder: "Select Status",
      type: "select",
      options: [
        { label: "Open", value: "false" },
        { label: "Closed", value: "true" },
      ],
    },
  ];

  const reportsFilterValues = {
    sourceUser,
    startDate,
    endDate,
    feedback,
    closedBy,
    isClosed,
  };

  const handleReportsFiltersChange = (vals: Record<string, unknown>) => {
    const newParams = new URLSearchParams(reportSearchParams);
    Object.entries(vals).forEach(([key, value]) => {
      if (value && value !== "") {
        newParams.set(key, value as string);
      } else {
        newParams.delete(key);
      }
    });
    newParams.set("reportPage", "1");
    setReportSearchParams(newParams);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Reports</CardTitle>
        <div className="text-sm text-muted-foreground">
          Total: {reportsTotalCount} reports
        </div>
      </CardHeader>
      <CardContent>
        {reportsError && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{reportsError.message}</AlertDescription>
          </Alert>
        )}
        <DataTable
          columns={reportsColumns.filter((column) => column.id !== "project")}
          data={reportsData?.data || []}
          loading={reportsLoading}
          pagesCount={reportsPagesCount}
          page={reportPage}
          limit={reportLimit}
          filters={reportsFilterDefinitions}
          filterValues={reportsFilterValues}
          onFiltersChange={handleReportsFiltersChange}
        />
      </CardContent>
    </Card>
  );
}

export default ProjectReportsPanel;
