import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { type FilterDefinition } from "@/components/ui/filters";
import { useModal } from "@/store/modal-store";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { getRoles } from "../api/roles.api";
import { useRoleColumns } from "../columns/role-columns";
import type { Role } from "../types/role.types";

const RoleListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { onOpen } = useModal();

  const keyword = searchParams.get("keyword") || "";
  const page = +searchParams.get("page") || 1;
  const limit = +searchParams.get("limit") || 10;

  // Add more filters here if needed
  const filters: FilterDefinition[] = [];
  const filterValues = { keyword };

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["roles", keyword, page, limit],
    queryFn: () => getRoles(),
  });
  const pagesCount = 1;

  const handleCreate = () => {
    onOpen("createRole");
  };

  const handleEdit = (role: Role) => {
    onOpen("updateRole", {
      id: role._id,
      key: role.key,
      permissions: role.permissions,
    });
  };

  const handleDelete = (role: Role) => {
    onOpen("deleteRole", { id: role._id, key: role.key });
  };

  const handleFiltersChange = (vals: Record<string, unknown>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(vals).forEach(([key, value]) => {
      if (value) newParams.set(key, value as string);
      else newParams.delete(key);
    });
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const roleColumns = useRoleColumns(handleEdit, handleDelete);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Roles</h1>
        <Button onClick={handleCreate}>
          <PlusIcon className="w-4 h-4" />
          Create Role
        </Button>
      </div>
      <DataTable
        columns={roleColumns}
        data={roles}
        loading={isLoading}
        disableSearch
        // pagesCount={pagesCount}
        // page={page}
        // limit={limit}
        // filters={filters}
        // filterValues={filterValues}
        // onFiltersChange={handleFiltersChange}
      />
    </DashboardLayout>
  );
};

export default RoleListPage;
