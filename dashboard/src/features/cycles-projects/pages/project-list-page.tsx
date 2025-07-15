import DashboardLayout from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { type FilterDefinition } from "@/components/ui/filters";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getProjects } from "../api/project.api";
import { useProjectColumns } from "../columns/project-columns";
import { type ProjectFilters } from "../types/project.types";

function ProjectListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const keyword = searchParams.get("keyword") || "";
  const page = +searchParams.get("page") || 1;
  const limit = +searchParams.get("limit") || 10;
  const status = searchParams.get("status") || "";
  const category = searchParams.get("category") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const sortOrder = searchParams.get("sortOrder") || "";

  const filters: ProjectFilters = {
    search,
    keyword,
    page,
    limit,
    status: status || undefined,
    category: category || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    sortBy: (sortBy as ProjectFilters["sortBy"]) || undefined,
    sortOrder: (sortOrder as ProjectFilters["sortOrder"]) || undefined,
  };

  const {
    data: projectsData,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["projects", filters],
    queryFn: () => getProjects(filters),
  });

  const projects = projectsData?.data || [];
  const pagesCount = projectsData?.pagination.totalPages || 0;
  const projectColumns = useProjectColumns(refetch);

  // Define filter options
  const filterDefinitions: FilterDefinition[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "All", value: "all" },
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
        { label: "Paused", value: "paused" },
        { label: "Deleted", value: "deleted" },
      ],
      placeholder: "Select Status",
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: [
        { label: "All Categories", value: "all" },
        { label: "Photography", value: "photography" },
        { label: "Videography", value: "videography" },
        { label: "Design", value: "design" },
        { label: "Writing", value: "writing" },
      ],
      placeholder: "Select Category",
    },
    {
      key: "startDate",
      label: "Start Date",
      type: "date",
      placeholder: "Select start date",
    },
    {
      key: "endDate",
      label: "End Date",
      type: "date",
      placeholder: "Select end date",
    },
    {
      key: "sortBy",
      label: "Sort By",
      type: "select",
      options: [
        { label: "Created Date", value: "createdAt" },
        { label: "Updated Date", value: "updatedAt" },
        { label: "Name", value: "name" },
        { label: "Favorites", value: "favouriteCount" },
        { label: "Duration", value: "duration" },
      ],
      placeholder: "Sort by",
    },
    {
      key: "sortOrder",
      label: "Sort Order",
      type: "select",
      options: [
        { label: "Ascending", value: "asc" },
        { label: "Descending", value: "desc" },
      ],
      placeholder: "Sort order",
    },
  ];

  const filterValues = {
    search,
    keyword,
    status,
    category,
    startDate,
    endDate,
    sortBy,
    sortOrder,
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
        <h1 className="text-2xl font-bold">Projects Content Management</h1>
        <div className="text-sm text-muted-foreground">
          Total: {projectsData?.pagination.resultCount || 0} projects
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <DataTable
        columns={projectColumns}
        data={projects}
        loading={loading}
        pagesCount={pagesCount}
        page={page}
        limit={limit}
        filters={filterDefinitions}
        filterValues={filterValues}
        onFiltersChange={handleFiltersChange}
        // searchPlaceholder="Search projects by title, ID, or keyword..."
      />
    </DashboardLayout>
  );
}

export default ProjectListPage;
