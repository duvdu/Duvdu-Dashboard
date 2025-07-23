import DashboardLayout from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { type FilterDefinition } from "@/components/ui/filters";
import { getCategories } from "@/features/categories/api/category.api";
import { UserSearchSelect } from "@/features/chat/components/UserSearchSelect";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getProjects } from "../api/project.api";
import { useProjectColumns } from "../columns/project-columns";
import { type ProjectFilters } from "../types/project.types";

function ProjectListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = +searchParams.get("page") || 1;
  const limit = +searchParams.get("limit") || 10;
  const category = searchParams.get("category") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const sortOrder = searchParams.get("sortOrder") || "";
  const showOnHome = searchParams.get("showOnHome") || "";
  const user = searchParams.get("user") || "";

  const filters: ProjectFilters = {
    search,
    page,
    limit,
    category: category || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    showOnHome: showOnHome || undefined,
    sortOrder: (sortOrder as ProjectFilters["sortOrder"]) || undefined,
    user: user || undefined,
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

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories({ limit: 1000, cycle: "project" }),
  });
  const categories = categoriesData?.data || [];

  const filterDefinitions: FilterDefinition[] = [
    {
      key: "user",
      label: "User",
      type: "custom",
      customComponent: (
        <UserSearchSelect
          selectedUserId={user}
          onSelectUser={(user) => {
            setSearchParams({ user: user?._id || "" });
          }}
        />
      ),
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: categories.map((category) => ({
        label: category.title.en,
        value: category._id,
      })),
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
      key: "showOnHome",
      label: "Show on Home",
      type: "select",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
      placeholder: "Show on Home",
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
    category,
    startDate,
    endDate,
    showOnHome,
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
      />
    </DashboardLayout>
  );
}

export default ProjectListPage;
