import { DataTable } from "@/components/ui/data-table";
import { type FilterDefinition } from "@/components/ui/filters";
import { UserSearchSelect } from "@/features/chat/components/UserSearchSelect";
import { getContracts } from "@/features/contracts/api/contract.api";
import { useContractColumns } from "@/features/contracts/columns/contract-columns";
import { type ContractRoot } from "@/features/contracts/types/contract.types";
import { useUpdateQueryParam } from "@/hooks/useUpdateQueryParam";
import { useQuery } from "@tanstack/react-query";

interface ProjectContractsPanelProps {
  id: string;
}

export default function ProjectContractsPanel({
  id,
}: ProjectContractsPanelProps) {
  const contractColumns = useContractColumns({});
  const { getQueryParam, updateQueryParam } = useUpdateQueryParam("contracts");
  const cycle = getQueryParam("cycle") || "";
  const type = getQueryParam("type") || "";
  const page = parseInt(getQueryParam("page") || "1");
  const limit = parseInt(getQueryParam("limit") || "5");
  const from = getQueryParam("from") || "";
  const to = getQueryParam("to") || "";
  const user = getQueryParam("user") || "";

  const filterValues = {
    cycle: cycle,
    type: type,
    from: from,
    to: to,
    page: page,
    limit: limit,
    user: user,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["contracts", "project", id, filterValues],
    queryFn: () =>
      getContracts({
        page: page || undefined,
        limit: limit || undefined,
        cycle: cycle || undefined,
        filter: type || undefined,
        from: from || undefined,
        to: to || undefined,
        project: id || undefined,
        user: user || undefined,
      }),
    enabled: !!id,
  });

  const contracts: ContractRoot[] = data?.data || [];

  const filterDefinitions: FilterDefinition[] = [
    {
      key: "user",
      label: "User",
      type: "custom",
      customComponent: (
        <UserSearchSelect
          placeholder="Select User"
          selectedUserId={user}
          onSelectUser={(user) => {
            if (user) {
              updateQueryParam("user", user._id);
            } else {
              updateQueryParam("user", "");
            }
          }}
        />
      ),
    },
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
