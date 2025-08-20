import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CSVExportButton } from "@/components/ui/csv-export-button";
import { DataTable } from "@/components/ui/data-table";
import { type FilterDefinition } from "@/components/ui/filters";
import { PERMISSION_KEYS } from "@/config/permissions";
import { useModal } from "@/store/modal-store";
import { useQuery } from "@tanstack/react-query";
import { BellIcon } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getUsers } from "../api/users.api";
import { useUserColumns } from "../columns/user-columns";
import { type User } from "../types/user.types";
import { fetchUsersForCSV } from "../utils/user-csv-export";

export default function UserListPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const page = +searchParams.get("page") || 1;
  const limit = +searchParams.get("limit") || 10;
  const status = searchParams.get("status") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const isOnline = searchParams.get("isOnline") || "";
  const {
    data: usersData,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users", keyword, page, limit, status, from, to, isOnline],
    queryFn: () =>
      getUsers({
        search: keyword,
        page,
        limit,
        isBlocked:
          status === "blocked" ? true : status === "active" ? false : undefined,
        isDeleted: status ? (status === "deleted" ? true : false) : undefined,
        isAdmin: false,
        from: from || undefined,
        to: to || undefined,
        isOnline: isOnline === "true" ? true : undefined,
      }),
  });
  const users = usersData?.data || [];
  const pagesCount = usersData?.pagination?.totalPages || 0;
  const userColumns = useUserColumns(refetch);
  const { onOpen } = useModal();

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const filters: FilterDefinition[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Suspended", value: "blocked" },
        { label: "Deleted", value: "deleted" },
      ],
      placeholder: "Select Status",
    },
    {
      key: "from",
      label: "From Date",
      placeholder: "Select From Date",
      type: "date",
    },
    {
      key: "to",
      label: "To Date",
      placeholder: "Select To Date",
      type: "date",
    },
    {
      key: "isOnline",
      label: "Online Users",
      type: "select",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
      placeholder: "Show Online Users",
    },
  ];
  const filterValues = { status, keyword, from, to, isOnline };

  const handleNotifyUsers = () => {
    const userIds = selectedUsers.map((user) => user._id);
    onOpen("sendNotification", { users: userIds }, () => {
      setSelectedUsers([]);
      refetch();
    });
  };

  const handleNotifyAllUsers = () => {
    onOpen("sendNotification", {}, () => {
      refetch();
    });
  };

  return (
    <DashboardLayout className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="flex gap-2">
          <ProtectedComponent
            permissionKey={PERMISSION_KEYS.NOTIFICATIONS.SEND}
          >
            <Button
              variant="outline"
              size="default"
              onClick={handleNotifyAllUsers}
            >
              <BellIcon className="w-4 h-4 mr-2" />
              Notify All Users
            </Button>
          </ProtectedComponent>
          <ProtectedComponent permissionKey={PERMISSION_KEYS.USERS.VIEW}>
            <CSVExportButton
              filename="users"
              fetchData={() =>
                fetchUsersForCSV({
                  search: keyword,
                  page,
                  limit,
                  status,
                })
              }
              variant="outline"
              size="default"
            />
          </ProtectedComponent>
        </div>
      </div>

      <ProtectedComponent permissionKey={PERMISSION_KEYS.NOTIFICATIONS.SEND}>
        {selectedUsers.length > 0 && (
          <div className="mb-4 flex items-center justify-between gap-2 bg-muted px-4 py-2 rounded border border-border">
            <span>{selectedUsers.length} selected</span>
            <Button size="sm" onClick={handleNotifyUsers}>
              <BellIcon className="w-4 h-4" />
              Notify Selected
            </Button>
          </div>
        )}
      </ProtectedComponent>

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
        onRowSelectionChange={setSelectedUsers}
      />
    </DashboardLayout>
  );
}
