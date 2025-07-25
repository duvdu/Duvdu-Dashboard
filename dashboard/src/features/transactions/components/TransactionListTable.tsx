import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { type FilterDefinition } from "@/components/ui/filters";
import { UserSearchSelect } from "@/features/chat";
import { getTransactions } from "@/features/transactions/api/transactions.api";
import { useTransactionColumns } from "@/features/transactions/columns/transaction-columns";
import { useUpdateQueryParam } from "@/hooks/useUpdateQueryParam";
import { useQuery } from "@tanstack/react-query";

const TransactionListTable = () => {
  const transactionColumns = useTransactionColumns();
  const { getQueryParam, updateQueryParam } =
    useUpdateQueryParam("transactions");
  const status = getQueryParam("status") || "";
  const page = parseInt(getQueryParam("page") || "1");
  const limit = parseInt(getQueryParam("limit") || "10");
  const from = getQueryParam("from") || "";
  const to = getQueryParam("to") || "";
  const user = getQueryParam("user") || "";
  const ticketNumber = getQueryParam("keyword") || "";

  const filterValues = {
    status: status,
    from: from,
    to: to,
    page: page,
    limit: limit,
    user: user,
    ticketNumber: ticketNumber,
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
        from: from || undefined,
        to: to || undefined,
        user: user || undefined,
        ticketNumber: ticketNumber || undefined,
        isSubscribed: false,
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
    <>
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
        searchPlaceholder="Search by Transaction Number"
        filterValues={filterValues}
        tableId="transactions"
      />
    </>
  );
};

export default TransactionListTable;
