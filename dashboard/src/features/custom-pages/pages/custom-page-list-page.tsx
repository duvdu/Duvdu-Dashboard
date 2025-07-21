import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { getCustomPages } from "../api/custom-page.api";
import { useCustomPageColumns } from "../columns/custom-page-columns";

export default function CustomPageListPage() {
  const [searchParams] = useSearchParams();
  const page = +searchParams.get("page") || 0;
  const limit = +searchParams.get("limit") || 10;

  const { data, isLoading } = useQuery({
    queryKey: ["custom-pages"],
    queryFn: () => getCustomPages({}),
  });
  const columns = useCustomPageColumns();
  return (
    <DashboardLayout loading={isLoading}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1>CustomPages</h1>
          <Link to="/dashboard/custom-pages/create">
            <Button>
              <PlusIcon className="w-4 h-4" />
              Create Custom Page
            </Button>
          </Link>
        </div>
        <DataTable
          page={page}
          limit={limit}
          pagesCount={data?.pagination.totalPages || 0}
          disableSearch
          columns={columns}
          data={data?.data || []}
        />
      </div>
    </DashboardLayout>
  );
}
