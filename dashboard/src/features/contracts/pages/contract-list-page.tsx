import { useQuery } from "@tanstack/react-query";
import { getContracts } from "../api/contract.api";
import { useContractColumns } from "../columns/contract-columns";
import { DataTable } from "@/components/ui/data-table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import { Button } from "@/components/ui/button";
import { PERMISSION_KEYS } from "@/config/permissions";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ContractListPage() {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") ?? 1;
  const limit = searchParams.get("limit") ?? 10;
  const { data, isLoading, error } = useQuery({
    queryKey: ["contracts"],
    queryFn: () => getContracts({}),
  });
  const columns = useContractColumns();
  const navigate = useNavigate();


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
        data={data?.data ?? []}
        loading={isLoading}
        pagesCount={data?.pagination?.totalPages ?? 0}
        page={Number(page)}
        limit={Number(limit)}
      />
    </DashboardLayout>
  );
}
