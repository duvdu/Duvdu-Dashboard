import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { type Role } from "../types/role.types";
import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import { PERMISSION_KEYS } from "@/config/permissions";

export const useRoleColumns = (
  onEdit: (role: Role) => void,
  onDelete: (role: Role) => void
): ColumnDef<Role>[] => {
  return [
    {
      accessorKey: "key",
      header: "Role Key",
      cell: ({ row }) => row.original.key || "-",
    },
    {
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }) => (
        <span className="truncate block max-w-xs">
          {row.original.permissions.join(", ") || "-"}
        </span>
      ),
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-8 w-8 p-0">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-0" align="end">
            <ProtectedComponent permissionKey={PERMISSION_KEYS.ROLES.UPDATE}>
              <Button
                variant="ghost"
                className="w-full justify-start rounded-none px-3 py-2"
                onClick={() => onEdit(row.original)}
              >
                <PencilIcon className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start rounded-none px-3 py-2 text-destructive"
                onClick={() => onDelete(row.original)}
              >
                <TrashIcon className="w-4 h-4" />
                Delete
              </Button>
            </ProtectedComponent>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};
