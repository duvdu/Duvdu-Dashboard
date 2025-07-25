import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { type FilterDefinition } from "@/components/ui/filters";

interface TransactionListTableProps {
  error?: any;
  isLoading: boolean;
  transactions: any[];
  pagesCount: number;
  page: number;
  limit: number;
  filterDefinitions: FilterDefinition[];
  filterValues: any;
  columns: any;
}

const TransactionListTable = ({
  error,
  isLoading,
  transactions,
  pagesCount,
  page,
  limit,
  filterDefinitions,
  filterValues,
  columns,
}: TransactionListTableProps) => {
  return (
    <>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <DataTable
        columns={columns}
        data={transactions}
        loading={isLoading}
        pagesCount={pagesCount}
        page={page}
        limit={limit}
        filters={filterDefinitions}
        searchPlaceholder="Search by Subscription Number"
        filterValues={filterValues}
        tableId="subscriptions"
      />
    </>
  );
};

export default TransactionListTable;
