import { DataTable } from "@/components/ui/data-table";
import { type FilterDefinition } from "@/components/ui/filters";
import { getFundTransactions } from "@/features/fund-transactions/api/fund-transaction.api";
import { useFundTransactionColumns } from "@/features/fund-transactions/columns/fund-transaction-columns";
import { type FundTransaction } from "@/features/fund-transactions/types/fund-transaction.types";
import { useUpdateQueryParam } from "@/hooks/useUpdateQueryParam";
import { useQuery } from "@tanstack/react-query";

interface ContractsFundTransactionsPanelProps {
  contractId?: string;
  userId?: string;
}

export default function ContractsFundTransactionsPanel({
  contractId,
  userId,
}: ContractsFundTransactionsPanelProps) {
  const fundTransactionColumns = useFundTransactionColumns();
  const { getQueryParam } = useUpdateQueryParam("fund-transactions");
  const status = getQueryParam("status") || "";
  const page = parseInt(getQueryParam("page") || "1");
  const limit = parseInt(getQueryParam("limit") || "5");
  const createdAtFrom = getQueryParam("createdAtFrom") || "";
  const createdAtTo = getQueryParam("createdAtTo") || "";
  const ticketNumber = getQueryParam("ticketNumber") || "";

  const filterValues = {
    status: status,
    page: page,
    limit: limit,
    createdAtFrom: createdAtFrom,
    createdAtTo: createdAtTo,
    contract: contractId,
    user: userId,
    ticketNumber: ticketNumber,
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["fund-transactions", contractId, filterValues],
    queryFn: () =>
      getFundTransactions({
        ticketNumber: ticketNumber || undefined,
        page: page || undefined,
        limit: limit || undefined,
        status: status || undefined,
        createdAtFrom: createdAtFrom || undefined,
        createdAtTo: createdAtTo || undefined,
        contract: contractId || undefined,
        user: userId,
      }),
  });

  if (error) {
    return (
      <div className="py-8 text-center text-destructive">
        Error loading payouts.
      </div>
    );
  }

  const fundTransactions: FundTransaction[] = data?.data || [];

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
      key: "createdAtFrom",
      label: "From Date",
      type: "date",
      placeholder: "Select From",
    },
    {
      key: "createdAtTo",
      label: "To Date",
      type: "date",
      placeholder: "Select To",
    },
  ];

  return (
    <DataTable
      columns={fundTransactionColumns}
      data={fundTransactions}
      loading={isLoading}
      pagesCount={data?.pagination?.totalPages}
      page={page}
      limit={limit}
      disableSearch
      tableId="fund-transactions"
      filters={filterDefinitions}
      filterValues={filterValues}
    />
  );
}
