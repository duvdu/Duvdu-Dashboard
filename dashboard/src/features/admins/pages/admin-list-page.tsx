import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { type FilterDefinition } from "@/components/ui/filters";
import { PERMISSION_KEYS } from "@/config/permissions";
import { getUsers } from "@/features/users/api/users.api";
import { useUserColumns } from "@/features/users/columns/user-columns";
import { useModal } from "@/store/modal-store";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export default function UserListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const page = +searchParams.get("page") || 1;
  const limit = +searchParams.get("limit") || 10;
  const status = searchParams.get("status") || "";
  const { onOpen } = useModal();

  const {
    data: usersData,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admins", keyword, page, limit, status],
    queryFn: () =>
      getUsers({
        search: keyword,
        page,
        limit,
        isBlocked:
          status === "blocked" ? true : status === "active" ? false : undefined,
        isAdmin: true,
      }),
  });
  const users = usersData?.data || [];
  const pagesCount = usersData?.pagination?.totalPages || 0;
  const userColumns = useUserColumns(refetch, { isAdmin: true });

  const filters: FilterDefinition[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Blocked", value: "blocked" },
      ],
      placeholder: "Select Status",
    },
  ];
  const filterValues = { status, keyword };
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
        <h1 className="text-2xl font-bold">Admins</h1>
        <ProtectedComponent permissionKey={PERMISSION_KEYS.ADMINS.CREATE}>
          <Button onClick={() => onOpen("createAdmin", {}, refetch)}>
            + New Admin
          </Button>
        </ProtectedComponent>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <DataTable
        columns={userColumns}
        data={users}
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
