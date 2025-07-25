import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { getRanks } from "../api/rank.api";
import { useRankColumns } from "../columns/rank-columns";
import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import { PERMISSION_KEYS } from "@/config/permissions";

export default function RankListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["ranks"],
    queryFn: () => getRanks({}),
  });
  const columns = useRankColumns();
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Ranks</h1>
        <ProtectedComponent permissionKey={PERMISSION_KEYS.RANKS.CREATE}>
          <Button asChild>
            <Link to="/dashboard/ranks/create">
              <PlusIcon className="w-4 h-4" />
              Add Rank
            </Link>
          </Button>
        </ProtectedComponent>
      </div>
      <DataTable
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
      />
    </DashboardLayout>
  );
}
