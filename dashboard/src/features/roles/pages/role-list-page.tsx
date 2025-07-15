import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useModal } from "@/store/modal-store";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import React from "react";
import { getRoles } from "../api/roles.api";
import { useRoleColumns } from "../columns/role-columns";
import type { Role } from "../types/role.types";

const RoleListPage: React.FC = () => {
  const { onOpen } = useModal();

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getRoles(),
  });

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
      />
    </DashboardLayout>
  );
};

export default RoleListPage;
