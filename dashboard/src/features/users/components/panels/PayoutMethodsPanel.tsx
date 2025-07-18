import { DataTable } from "@/components/ui/data-table";
import { type FilterDefinition } from "@/components/ui/filters";
import { useUpdateQueryParam } from "@/hooks/useUpdateQueryParam";
import { useQuery } from "@tanstack/react-query";
import { getUserWithdrawMethods } from "../../api/users.api";
import { usePayoutMethodColumns } from "../../columns/payout-method-columns";
import {
  type PayoutMethod,
  type PayoutMethodListResponse,
} from "../../types/payout-method.types";

interface PayoutMethodsPanelProps {
  userId: string;
}

export default function PayoutMethodsPanel({
  userId,
}: PayoutMethodsPanelProps) {
  const payoutMethodColumns = usePayoutMethodColumns();
  const { getQueryParam } = useUpdateQueryParam("payout-methods");
  const status = getQueryParam("status") || "";
  const method = getQueryParam("method") || "";
  const keyword = getQueryParam("keyword") || "";
  const page = parseInt(getQueryParam("page") || "1");
  const limit = parseInt(getQueryParam("limit") || "5");

  const filterValues = {
    status: status,
    method: method,
    search: keyword,
    page: page,
    limit: limit,
  };

  const { data, isLoading, error } = useQuery<PayoutMethodListResponse>({
    queryKey: ["withdraw-methods", userId, filterValues],
    queryFn: () =>
      getUserWithdrawMethods({
        user: userId,
        status: status && status !== "deleted" ? status : undefined,
        isDeleted: status === "deleted" ? true : undefined,
        method: method || undefined,
        search: keyword || undefined,
        page: page || undefined,
        limit: limit || undefined,
      }),
  });

  if (error) {
    return (
      <div className="py-8 text-center text-destructive">
        Error loading payout methods.
      </div>
    );
  }
  const methods: PayoutMethod[] = data?.data || [];

  // Filter definitions
  const filterDefinitions: FilterDefinition[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Deleted", value: "deleted" },
      ],
      placeholder: "Select Status",
    },
    {
      key: "method",
      label: "Method",
      type: "select",
      options: [
        { label: "Bank", value: "bank" },
        { label: "Wallet", value: "wallet" },
      ],
      placeholder: "Select Method",
    },
  ];

  return (
    <DataTable
      columns={payoutMethodColumns}
      data={methods}
      loading={isLoading}
      pagesCount={data?.pagination?.totalPages}
      page={page}
      limit={limit}
      disableSearch
      tableId="payout-methods"
      filters={filterDefinitions}
      filterValues={filterValues}
    />
  );
}
