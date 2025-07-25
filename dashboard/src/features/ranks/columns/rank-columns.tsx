import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useModal } from "@/store/modal-store";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { type Rank } from "../types/rank.types";
import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import { PERMISSION_KEYS } from "@/config/permissions";

export const useRankColumns = (): ColumnDef<Rank>[] => {
  const { onOpen } = useModal();
  return [
    {
      accessorKey: "rank",
      header: "Rank",
      cell: ({ row }) => row.original.rank,
    },
    {
      accessorKey: "actionCount",
      header: "Contracts Count",
      cell: ({ row }) => row.original.actionCount,
    },
    {
      accessorKey: "projectsCount",
      header: "Projects Count",
      cell: ({ row }) => row.original.projectsCount,
    },
    {
      accessorKey: "projectsLiked",
      header: "Projects Liked",
      cell: ({ row }) => row.original.projectsLiked,
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => (
        <div
          style={{
            width: 24,
            height: 24,
            background: row.original.color,
            borderRadius: "50%",
          }}
        />
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "-",
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
            <ProtectedComponent permissionKey={PERMISSION_KEYS.RANKS.UPDATE}>
              <Button
                variant="ghost"
                className="w-full justify-start rounded-none px-3 py-2"
              >
                <Link
                  to={`/dashboard/ranks/update/${row.original._id}`}
                  className="flex items-center gap-2"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit
                </Link>
              </Button>
            </ProtectedComponent>
            <ProtectedComponent permissionKey={PERMISSION_KEYS.RANKS.DELETE}>
              <Button
                variant="ghost"
                className="w-full justify-start rounded-none px-3 py-2 text-destructive"
                onClick={() => onOpen("deleteRank", { id: row.original._id })}
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
