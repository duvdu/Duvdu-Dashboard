import DashboardLayout from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { type FilterDefinition } from "@/components/ui/filters";
import { UserSearchSelect } from "@/features/chat";
import { useUpdateQueryParam } from "@/hooks/useUpdateQueryParam";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../api/transactions.api";
import { useTransactionColumns } from "../columns/transaction-columns";

export default function TransactionsListPage() {
  const transactionColumns = useTransactionColumns();
  const { getQueryParam, updateQueryParam } =
    useUpdateQueryParam("transactions");
  const status = getQueryParam("status") || "";
  const type = getQueryParam("type") || "";
  const page = parseInt(getQueryParam("page") || "1");
  const limit = parseInt(getQueryParam("limit") || "10");
  const from = getQueryParam("from") || "";
  const to = getQueryParam("to") || "";
  const user = getQueryParam("user") || "";
  const isSubscription = getQueryParam("isSubscription") || "";

  const filterValues = {
    status: status,
    type: type,
    from: from,
    to: to,
    page: page,
    limit: limit,
    user: user,
    isSubscription: isSubscription,
  };

  const {
    data: transactionsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transactions", filterValues],
    queryFn: () =>
      getTransactions({
        page: page || undefined,
        limit: limit || undefined,
        status: status || undefined,
        type: type || undefined,
        from: from || undefined,
        to: to || undefined,
        user: user || undefined,
        isSubscribed:
          isSubscription === "true"
            ? true
            : isSubscription === "false"
            ? false
            : undefined,
      }),
  });
  const transactions = transactionsData?.data || [];
  const pagesCount = transactionsData?.pagination?.totalPages || 0;

  // Filter definitions
  const filterDefinitions: FilterDefinition[] = [
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
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Success", value: "success" },
        { label: "Failed", value: "failed" },
      ],
      placeholder: "Select Status",
    },
    {
      key: "type",
      label: "Type",
      type: "select",
      options: [
        { label: "Deposit", value: "deposit" },
        { label: "Withdraw", value: "withdraw" },
      ],
      placeholder: "Select Type",
    },
    {
      key: "isSubscription",
      label: "Is Subscription",
      type: "select",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
      placeholder: "Select Is Subscription",
    },
    {
      key: "from",
      label: "From",
      type: "date",
      placeholder: "Select From",
    },
    {
      key: "to",
      label: "To",
      type: "date",
      placeholder: "Select To",
    },
  ];

  return (
    <DashboardLayout className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <DataTable
        columns={transactionColumns}
        data={transactions}
        loading={isLoading}
        pagesCount={pagesCount}
        page={page}
        limit={limit}
        filters={filterDefinitions}
        filterValues={filterValues}
        tableId="transactions"
      />
    </DashboardLayout>
  );
}
