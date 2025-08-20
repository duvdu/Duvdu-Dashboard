import DashboardLayout from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { type FilterDefinition } from "@/components/ui/filters";
import { UserSearchSelect } from "@/features/chat";
import { getProjects } from "@/features/cycles-projects/api/project.api";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getProjectReviews } from "../api/project-review.api";
import { useProjectReviewColumns } from "../columns/project-review-columns";

export default function ProjectReviewListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = +searchParams.get("page") || 1;
  const limit = +searchParams.get("limit") || 10;
  const user = searchParams.get("user") || "";
  const project = searchParams.get("project") || "";

  const filters = {
    search,
    page,
    limit,
    user: user || undefined,
    project: project || undefined,
  };

  const {
    data: reviewsData,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["project-reviews", filters],
    queryFn: () => getProjectReviews(filters),
  });

  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects({ page: 1, limit: 1000 }),
  });
  const projects = projectsData?.data || [];

  const reviews = reviewsData?.data || [];
  const pagesCount = reviewsData?.pagination.totalPages || 0;
  const totalCount = reviewsData?.pagination.resultCount || 0;
  const columns = useProjectReviewColumns();

  // Only user, project, and search filters
  const filterDefinitions: FilterDefinition[] = [
    {
      key: "user",
      label: "User",
      type: "custom",
      customComponent: (
        <UserSearchSelect
          onSelectUser={(user) => {
            setSearchParams({ user: user._id });
          }}
        />
      ),
    },
    {
      key: "project",
      label: "Project",
      type: "select",
      options: projects.map((project) => ({
        label: project.name,
        value: project._id,
      })),
      placeholder: "Select Project",
    },
    // Search is handled by the DataTable search input
  ];

  const filterValues = {
    user,
    project,
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
        <h1 className="text-2xl font-bold">Project Reviews</h1>
        <div className="text-sm text-muted-foreground">
          Total: {totalCount} reviews
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
        data={reviews}
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
