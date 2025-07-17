import { DataTable } from "@/components/ui/data-table";
import { type FilterDefinition } from "@/components/ui/filters";
import { getContracts } from "../api/contract.api";
import { useContractColumns } from "../columns/contract-columns";
import { type ContractRoot } from "../types/contract.types";
import { useUpdateQueryParam } from "@/hooks/useUpdateQueryParam";
import { useQuery } from "@tanstack/react-query";

interface ContractsPanelProps {
  userId: string;
}

export default function ContractsPanel({ userId }: ContractsPanelProps) {
  const contractColumns = useContractColumns();
  const { getQueryParam } = useUpdateQueryParam("contracts");
  const status = getQueryParam("status") || "";
  const type = getQueryParam("type") || "";
  const page = parseInt(getQueryParam("page") || "1");
  const limit = parseInt(getQueryParam("limit") || "10");
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
    queryKey: ["contracts", userId, filterValues],
    queryFn: () =>
      getContracts({
        user: userId,
        page: page || undefined,
        limit: limit || undefined,
        status: status || undefined,
        type: type || undefined,
        from: from || undefined,
        to: to || undefined,
      }),
  });

  if (error) {
    return (
      <div className="py-8 text-center text-destructive">
        Error loading contracts.
      </div>
    );
  }
  const contracts: ContractRoot[] = data?.data || [];

  // Filter definitions
  const filterDefinitions: FilterDefinition[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Ongoing", value: "ongoing" },
        { label: "Accepted", value: "accepted" },
        { label: "Canceled", value: "canceled" },
      ],
      placeholder: "Select Status",
    },
    {
      key: "type",
      label: "Type",
      type: "select",
      options: [
        { label: "Service Provider", value: "sp" },
        { label: "Client", value: "customer" },
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
      columns={contractColumns}
      data={contracts}
      loading={isLoading}
      pagesCount={data?.pagination?.totalPages}
      page={page}
      limit={limit}
      disableSearch
      tableId="contracts"
      filters={filterDefinitions}
      filterValues={filterValues}
    />
  );
}
