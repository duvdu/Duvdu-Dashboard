import DashboardLayout from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import type { FilterDefinition } from "@/components/ui/filters";
import { UserSearchSelect } from "@/features/chat";
import { useUpdateQueryParam } from "@/hooks/useUpdateQueryParam";
import { useQuery } from "@tanstack/react-query";
import { getCancelledContracts } from "../api/cancelled-contract.api";
import { useCancelledContractColumns } from "../columns/cancelled-contract-columns";
import type { CancelledContract } from "../types/cancelled-contract.types";

export default function CancelledContractListPage() {
  const { getQueryParam, updateQueryParam } = useUpdateQueryParam(
    "cancelled-contracts"
  );

  const page = parseInt(getQueryParam("page") || "1");
  const limit = parseInt(getQueryParam("limit") || "10");
  const search = getQueryParam("keyword") || "";
  const user = getQueryParam("user") || "";

  const filterValues = {
    page: page,
    limit: limit,
    search: search,
    user: user,
  };

  const columns = useCancelledContractColumns();

  const { data, isLoading, error } = useQuery({
    queryKey: ["cancelled-contracts", filterValues],
    queryFn: () =>
      getCancelledContracts({
        page: page || undefined,
        limit: limit || undefined,
        search: search || undefined,
        user: user || undefined,
      }),
  });

  const filterDefinitions: FilterDefinition[] = [
    {
      label: "User",
      key: "user",
      type: "custom",
      customComponent: (
        <UserSearchSelect
          placeholder="Search by user"
          onSelectUser={(user) => updateQueryParam("user", user._id || "")}
          selectedUserId={user}
        />
      ),
    },
  ];

  if (error) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.response?.data?.errors?.[0]?.message || error.message}
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }
  const cancelledContracts: CancelledContract[] = data?.data || [];

  return (
    <DashboardLayout className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Cancelled Contracts</h1>
      </div>
      <DataTable
        columns={columns}
        data={cancelledContracts}
        loading={isLoading}
        pagesCount={data?.pagination?.totalPages ?? 0}
        filterValues={filterValues}
        filters={filterDefinitions}
        page={Number(page)}
        tableId="cancelled-contracts"
        limit={Number(limit)}
      />
    </DashboardLayout>
  );
}
