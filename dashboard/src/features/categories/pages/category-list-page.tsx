import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { type FilterDefinition } from "@/components/ui/filters";
import { PERMISSION_KEYS } from "@/config/permissions";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCategories } from "../api/category.api";
import { useCategoryColumns } from "../columns/category-columns";

function CategoryListPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const page = +searchParams.get("page") || 1;
  const limit = +searchParams.get("limit") || 10;
  const cycle = searchParams.get("cycle") || "";
  const status = searchParams.get("status") || "";
  const isRelated = searchParams.get("isRelated") || "";
  console.log(isRelated === "false");
  const {
    data: categoriesData,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["categories", keyword, page, limit, cycle, status, isRelated],
    queryFn: () =>
      getCategories({
        search: keyword,
        page,
        limit,
        cycle,
        status,
        isRelated:
          isRelated === "true"
            ? true
            : isRelated === "false"
            ? false
            : undefined,
      }),
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
        { label: "Rentals", value: "rentals" },
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
    {
      key: "isRelated",
      label: "Type",
      type: "select",
      placeholder: "Select Type",
      options: [
        { label: "Related Category", value: "true" },
        { label: "Main Category", value: "false" },
      ],
    },
  ];
  const filterValues = { cycle, status, keyword, isRelated };

  return (
    <DashboardLayout className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <ProtectedComponent permissionKey={PERMISSION_KEYS.CATEGORIES.CREATE}>
          <Button onClick={() => navigate("../categories/create")}>
            + New Category
          </Button>
        </ProtectedComponent>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <ProtectedComponent permissionKey={PERMISSION_KEYS.CATEGORIES.VIEW}>
        <DataTable
          columns={categoryColumns}
          data={categories}
          loading={loading}
          pagesCount={pagesCount}
          page={page}
          limit={limit}
          filters={filters}
          filterValues={filterValues}
        />
      </ProtectedComponent>
    </DashboardLayout>
  );
}

export default CategoryListPage;
