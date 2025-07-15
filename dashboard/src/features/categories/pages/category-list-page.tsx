import DashboardLayout from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { type FilterDefinition } from "@/components/ui/filters";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCategories } from "../api/category.api";
import { useCategoryColumns } from "../columns/category-columns";

function CategoryListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const page = +searchParams.get("page") || 1;
  const limit = +searchParams.get("limit") || 10;
  const cycle = searchParams.get("cycle") || "";
  const status = searchParams.get("status") || "";
  const {
    data: categoriesData,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["categories", keyword, page, limit, cycle, status],
    queryFn: () =>
      getCategories({ search: keyword, page, limit, cycle, status }),
  });
  const categories = categoriesData?.data || [];
  const pagesCount = categoriesData?.pagination.totalPages || 0;
  const navigate = useNavigate();
  const categoryColumns = useCategoryColumns(refetch);
  // Define filter options
  const filters: FilterDefinition[] = [
    {
      key: "cycle",
      label: "Cycle",
      type: "select",
      options: [
        { label: "Producer", value: "producer" },
        { label: "Copy-rights", value: "copy-rights" },
        { label: "Project", value: "project" },
        { label: "Studio-booking", value: "studio-booking" },
      ],
      placeholder: "Select Cycle",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
      placeholder: "Select Status",
    },
  ];
  const filterValues = { cycle, status, keyword };
  const handleFiltersChange = (vals: Record<string, unknown>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(vals).forEach(([key, value]) => {
      if (value) newParams.set(key, value as string);
      else newParams.delete(key);
    });
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  return (
    <DashboardLayout className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => navigate("../categories/create")}>
          + New Category
        </Button>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <DataTable
        columns={categoryColumns}
        data={categories}
        loading={loading}
        pagesCount={pagesCount}
        page={page}
        limit={limit}
        filters={filters}
        filterValues={filterValues}
        onFiltersChange={handleFiltersChange}
      />
    </DashboardLayout>
  );
}

export default CategoryListPage;
