import DashboardLayout from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import type { FilterDefinition } from "@/components/ui/filters";
import { UserSearchSelect } from "@/features/chat";
import { useUpdateQueryParam } from "@/hooks/useUpdateQueryParam";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getContracts } from "../api/contract.api";
import { StatusSelect } from "../components/StatusSelect";
import { useContractColumns } from "../columns/contract-columns";
import type { ContractRoot } from "../types/contract.types";

export default function ContractListPage() {
  const { getQueryParam, updateQueryParam } = useUpdateQueryParam("contracts");

  const cycle = getQueryParam("cycle") || "";
  const page = parseInt(getQueryParam("page") || "1");
  const limit = parseInt(getQueryParam("limit") || "10");
  const from = getQueryParam("from") || "";
  const to = getQueryParam("to") || "";
  const user = getQueryParam("user") || "";
  const ticketNumber = getQueryParam("keyword") || "";
  const status = getQueryParam("status") || "";

  // Clear status filter when cycle changes
  useEffect(() => {
    if (status && cycle) {
      const cycleStatuses = {
        "copy-rights": {
          canceled: "canceled",
          pending: "pending",
          "waiting-for-pay-10": "waiting-for-pay-10",
          "update-after-first-Payment": "update-after-first-Payment",
          "waiting-for-total-payment": "waiting-for-total-payment",
          ongoing: "ongoing",
          completed: "completed",
          rejected: "rejected",
          complaint: "complaint",
        },
        project: {
          canceled: "canceled",
          pending: "pending",
          "waiting-for-pay-10": "waiting-for-pay-10",
          "update-after-first-Payment": "update-after-first-Payment",
          "waiting-for-total-payment": "waiting-for-total-payment",
          ongoing: "ongoing",
          completed: "completed",
          rejected: "rejected",
          complaint: "complaint",
        },
        rentals: {
          canceled: "canceled",
          pending: "pending",
          "waiting-for-payment": "waiting-for-payment",
          ongoing: "ongoing",
          completed: "completed",
          rejected: "rejected",
          complaint: "complaint",
        },
        producer: {
          canceled: "canceled",
          pending: "pending",
          accepted: "accepted",
          rejected: "rejected",
          complaint: "complaint",
          "accepted with update": "accepted with update",
        },
      };

      const cycleStatusesForCycle =
        cycleStatuses[cycle as keyof typeof cycleStatuses];
      if (
        cycleStatusesForCycle &&
        !Object.values(cycleStatusesForCycle).includes(status)
      ) {
        updateQueryParam("status", "");
      }
    }
  }, [cycle, status, updateQueryParam]);

  const filterValues = {
    cycle: cycle,
    from: from,
    to: to,
    page: page,
    limit: limit,
    user: user,
    ticketNumber: ticketNumber,
    status: status,
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
        user: user || undefined,
        ticketNumber: ticketNumber || undefined,
        status: status || undefined,
      }),
  });

  const filterDefinitions: FilterDefinition[] = [
    {
      key: "user",
      label: "User",
      type: "custom",
      customComponent: (
        <UserSearchSelect
          onSelectUser={(user) => {
            updateQueryParam("user", user?._id || "");
          }}
          selectedUserId={user}
        />
      ),
      placeholder: "Select User",
    },
    {
      key: "cycle",
      label: "Cycle",
      type: "select",
      options: [
        { label: "Producer", value: "producer" },
        { label: "Copy Rights", value: "copy-rights" },
        { label: "Rentals", value: "rentals" },
        { label: "Project", value: "project" },
      ],
      placeholder: "Select Cycle",
    },
    {
      key: "status",
      label: "Status",
      type: "custom",
      customComponent: (
        <StatusSelect
          value={status}
          onValueChange={(value) => updateQueryParam("status", value)}
          selectedCycle={cycle}
          placeholder="Select Status"
        />
      ),
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

  if (error) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.response?.data?.errors?.[0]?.message}
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }
  const contracts: ContractRoot[] = data?.data || [];

  return (
    <DashboardLayout className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Contracts</h1>
        {/* <ProtectedComponent permissionKey={PERMISSION_KEYS.CONTRACTS.CREATE}>
          <Button onClick={() => navigate("../contracts/create")}>
            + New Contract
          </Button>
        </ProtectedComponent> */}
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
        searchPlaceholder="Search by Contract Number"
        limit={Number(limit)}
      />
    </DashboardLayout>
  );
}
