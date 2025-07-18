import { DataTable } from "@/components/ui/data-table";
import { type FilterDefinition } from "@/components/ui/filters";
import { getTransactions } from "@/features/transactions/api/transactions.api";
import { useTransactionColumns } from "@/features/transactions/columns/transaction-columns";
import { type Transaction } from "@/features/transactions/types/transaction.types";
import { useUpdateQueryParam } from "@/hooks/useUpdateQueryParam";
import { useQuery } from "@tanstack/react-query";

interface SubscriptionsPanelProps {
  userId: string;
}

export default function SubscriptionsPanel({
  userId,
}: SubscriptionsPanelProps) {
  console.log("userId", userId);
  const transactionColumns = useTransactionColumns();
  const { getQueryParam } = useUpdateQueryParam("subscriptions");
  const status = getQueryParam("status") || "";
  const type = getQueryParam("type") || "";
  const page = parseInt(getQueryParam("page") || "1");
  const limit = parseInt(getQueryParam("limit") || "5");
  const from = getQueryParam("from") || "";
  const to = getQueryParam("to") || "";

  const filterValues = {
    status: status,
    type: type,
    from: from,
    to: to,
    page: page,
    limit: limit,
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["subscriptions", userId, filterValues],
    queryFn: () =>
      getTransactions({
        user: userId,
        page: page || undefined,
        limit: limit || undefined,
        status: status || undefined,
        type: type || undefined,
        from: from || undefined,
        to: to || undefined,
        isSubscribed: true,
      }),
  });

  if (error) {
    return (
      <div className="py-8 text-center text-destructive">
        Error loading transactions.
      </div>
    );
  }
  const transactions: Transaction[] = data?.data || [];

  // Filter definitions
  const filterDefinitions: FilterDefinition[] = [
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
    <DataTable
      columns={transactionColumns}
      data={transactions}
      loading={isLoading}
      pagesCount={data?.pagination?.totalPages}
      page={page}
      limit={limit}
      disableSearch
      tableId="subscriptions"
      filters={filterDefinitions}
      filterValues={filterValues}
    />
  );
}
