import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { FilterDefinition } from "@/components/ui/filters";
import { PERMISSION_KEYS } from "@/config/permissions";
import { useUpdateQueryParam } from "@/hooks/useUpdateQueryParam";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getContracts } from "../api/contract.api";
import { useContractColumns } from "../columns/contract-columns";
import type { ContractRoot } from "../types/contract.types";

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

export default function ContractListPage() {
  const navigate = useNavigate();

  const { getQueryParam } = useUpdateQueryParam("contracts");

  const cycle = getQueryParam("cycle") || "";
  const page = parseInt(getQueryParam("page") || "1");
  const limit = parseInt(getQueryParam("limit") || "10");
  const from = getQueryParam("from") || "";
  const to = getQueryParam("to") || "";

  const filterValues = {
    cycle: cycle,
    from: from,
    to: to,
    page: page,
    limit: limit,
  };

  const columns = useContractColumns({});

  const { data, isLoading, error } = useQuery({
    queryKey: ["contracts", filterValues],
    queryFn: () =>
      getContracts({
        page: page || undefined,
        limit: limit || undefined,
        cycle: cycle || undefined,
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

  return (
    <DashboardLayout className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Contracts</h1>
        <ProtectedComponent permissionKey={PERMISSION_KEYS.CONTRACTS.CREATE}>
          <Button onClick={() => navigate("../contracts/create")}>
            + New Contract
          </Button>
        </ProtectedComponent>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}{" "}
      <DataTable
        columns={columns}
        data={contracts}
        loading={isLoading}
        pagesCount={data?.pagination?.totalPages ?? 0}
        filterValues={filterValues}
        filters={filterDefinitions}
        page={Number(page)}
        tableId="contracts"
        disableSearch
        limit={Number(limit)}
      />
    </DashboardLayout>
  );
}
