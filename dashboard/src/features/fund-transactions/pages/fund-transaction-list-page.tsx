import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { FilterDefinition } from "@/components/ui/filters";
import { PERMISSION_KEYS } from "@/config/permissions";
import { useUpdateQueryParam } from "@/hooks/useUpdateQueryParam";
import { useModal } from "@/store/modal-store";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { getFundTransactions } from "../api/fund-transaction.api";
import { useFundTransactionColumns } from "../columns/fund-transaction-columns";
import { UserSearchSelect } from "@/features/chat/components/UserSearchSelect";

export default function FundTransactionListPage() {
  const { onOpen } = useModal();
  const { getQueryParam, updateQueryParam } =
    useUpdateQueryParam("fund-transactions");
  const status = getQueryParam("status") || "";
  const page = parseInt(getQueryParam("page") || "1");
  const limit = parseInt(getQueryParam("limit") || "10");
  const fundAmountFrom = getQueryParam("fundAmountFrom") || "";
  const fundAmountTo = getQueryParam("fundAmountTo") || "";
  const createdAtFrom = getQueryParam("createdAtFrom") || "";
  const createdAtTo = getQueryParam("createdAtTo") || "";
  const contract = getQueryParam("contract") || "";
  const user = getQueryParam("user") || "";

  const filterValues = {
    status: status,
    page: page,
    limit: limit,
    fundAmountFrom: fundAmountFrom,
    fundAmountTo: fundAmountTo,
    createdAtFrom: createdAtFrom,
    createdAtTo: createdAtTo,
    contract: contract,
    user: user,
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["fund-transactions", filterValues],
    queryFn: () =>
      getFundTransactions({
        page: page || undefined,
        limit: limit || undefined,
        status: status || undefined,
        fundAmountFrom: fundAmountFrom ? parseFloat(fundAmountFrom) : undefined,
        fundAmountTo: fundAmountTo ? parseFloat(fundAmountTo) : undefined,
        createdAtFrom: createdAtFrom || undefined,
        createdAtTo: createdAtTo || undefined,
        ticketNumber: contract || undefined,
        user: user || undefined,
      }),
  });
  const columns = useFundTransactionColumns();

  const filterDefinition: FilterDefinition[] = [
    {
      key: "user",
      label: "User",
      type: "custom",
      customComponent: (
        <UserSearchSelect
          selectedUserId={user}
          onSelectUser={(user) => {
            updateQueryParam("user", user?._id || "");
          }}
        />
      ),
    },
    {
      label: "Status",
      key: "status",
      type: "select",
      placeholder: "Select Status",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Success", value: "success" },
        { label: "Failed", value: "failed" },
      ],
    },

    {
      label: "Created At From",
      placeholder: "Select from",
      key: "createdAtFrom",
      type: "date",
    },
    {
      label: "Created At To",
      placeholder: "Select to",
      key: "createdAtTo",
      type: "date",
    },
    {
      label: "Contract",
      placeholder: "Select by Contract ID",
      key: "contract",
      type: "text",
    },
  ];

  if (error) {
    return (
      <DashboardLayout>
        <Alert>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.response?.data?.errors?.[0]?.message ||
              "An error occurred while fetching the payout"}
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Payouts</h1>
        <div className="flex gap-2">
          <ProtectedComponent
            permissionKeys={[PERMISSION_KEYS.FUND_TRANSACTIONS.CREATE]}
          >
            <Button onClick={() => onOpen("createFundTransaction")}>
              <PlusIcon className="w-4 h-4" />
              Create Payout
            </Button>
          </ProtectedComponent>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
        filters={filterDefinition}
        filterValues={filterValues}
        disableSearch
        tableId="fund-transactions"
        limit={limit}
        page={page}
      />
    </DashboardLayout>
  );
}
