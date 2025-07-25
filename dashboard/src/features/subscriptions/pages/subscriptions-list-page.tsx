import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionListAnalytics from "../components/SubscriptionListAnalytics";
import TransactionListTable from "../components/SubscriptionListTable";
import { type FilterDefinition } from "@/components/ui/filters";
import { UserSearchSelect } from "@/features/chat";
import { useUpdateQueryParam } from "@/hooks/useUpdateQueryParam";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/features/transactions/api/transactions.api";
import { useSubscriptionColumns } from "../columns/subscription-columns";

export default function SubscriptionsListPage() {
  const transactionColumns = useSubscriptionColumns();
  const { getQueryParam, updateQueryParam } =
    useUpdateQueryParam("subscriptions");
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
    queryKey: ["subscriptions", filterValues],
    queryFn: () =>
      getTransactions({
        page: page || undefined,
        limit: limit || undefined,
        status: status || undefined,
        from: from || undefined,
        to: to || undefined,
        user: user || undefined,
        ticketNumber: ticketNumber || undefined,
        isSubscribed: true,
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
    <DashboardLayout className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
      </div>
      <Tabs defaultValue="table">
        <TabsList className="grid grid-cols-1 md:grid-cols-2">
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <TransactionListTable
            error={error}
            isLoading={isLoading}
            transactions={transactions}
            pagesCount={pagesCount}
            page={page}
            limit={limit}
            filterDefinitions={filterDefinitions}
            filterValues={filterValues}
            columns={transactionColumns}
          />
        </TabsContent>
        <TabsContent value="analytics">
          <TransactionListAnalytics />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
