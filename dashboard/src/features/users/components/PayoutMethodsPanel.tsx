import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { getUserWithdrawMethods } from "../api/users.api";
import { payoutMethodColumns } from "../columns/payout-method-columns";
import {
  type PayoutMethod,
  type PayoutMethodListResponse,
} from "../types/payout-method.types";

interface PayoutMethodsPanelProps {
  userId: string;
}

export default function PayoutMethodsPanel({
  userId,
}: PayoutMethodsPanelProps) {
  const { data, isLoading, error } = useQuery<PayoutMethodListResponse>({
    queryKey: ["user-withdraw-methods", userId],
    queryFn: () => getUserWithdrawMethods({ user: userId }),
  });

  if (error) {
    return (
      <div className="py-8 text-center text-destructive">
        Error loading payout methods.
      </div>
    );
  }
  const methods: PayoutMethod[] = data?.data || [];

  return (
    <DataTable
      columns={payoutMethodColumns}
      data={methods}
      loading={isLoading}
      pagesCount={data?.pagination?.totalPages}
      page={data?.pagination?.currentPage}
      limit={data?.pagination?.resultCount}
      tableId="payout-methods"
    />
  );
}
