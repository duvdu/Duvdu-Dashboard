import { DataTable } from "@/components/ui/data-table";
import { type FilterDefinition } from "@/components/ui/filters";
import { useUpdateQueryParam } from "@/hooks/useUpdateQueryParam";
import { useQuery } from "@tanstack/react-query";
import { getContracts } from "../api/contract.api";
import { useContractColumns } from "../columns/contract-columns";
import { type ContractRoot } from "../types/contract.types";

interface ContractsPanelProps {
  userId: string;
}

export default function ContractsPanel({ userId }: ContractsPanelProps) {
  const contractColumns = useContractColumns({
    userId,
  });
  const { getQueryParam } = useUpdateQueryParam("contracts");
  const cycle = getQueryParam("cycle") || "";
  const type = getQueryParam("type") || "";
  const page = parseInt(getQueryParam("page") || "1");
  const limit = parseInt(getQueryParam("limit") || "5");
  const from = getQueryParam("from") || "";
  const to = getQueryParam("to") || "";

  const filterValues = {
    cycle: cycle,
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
        cycle: cycle || undefined,
        filter: type || undefined,
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
      key: "cycle",
      label: "Cycle",
      type: "select",
      options: [
        { label: "Producer", value: "producer" },
        { label: "Team Project", value: "team-project" },
        { label: "Copy Rights", value: "copy-rights" },
        { label: "Rentals", value: "rentals" },
        { label: "Project", value: "project" },
      ],
      placeholder: "Select Cycle",
    },
    {
      key: "type",
      label: "Type",
      type: "select",
      options: [
        { label: "My Bookings", value: "i_created" },
        { label: "My Clients", value: "i_received" },
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
