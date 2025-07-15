import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { PERMISSION_KEYS } from "@/config/permissions";
import { useModal } from "@/store/modal-store";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  MoreHorizontalIcon,
  PencilIcon,
  SquareArrowOutUpRightIcon,
  TrashIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { type Category } from "../types/category.types";

export const useCategoryColumns = (
  refetch?: () => void
): ColumnDef<Category>[] => {
  const { onOpen } = useModal();
  return [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <Image src={row.original.image} alt={row.original.title.en} preview />
      ),
    },
    {
      accessorKey: "title.en",
      header: "Title (EN)",
      cell: ({ row }) => row.original.title.en,
    },
    {
      accessorKey: "title.ar",
      header: "Title (AR)",
      cell: ({ row }) => row.original.title.ar,
    },
    {
      accessorKey: "cycle",
      header: "Cycle",
      cell: ({ row }) => row.original.cycle,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status ? "default" : "outline"}>
          {row.original.status ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      accessorKey: "trend",
      header: "Trend",
      cell: ({ row }) => (
        <Switch
          className="cursor-default pointer-events-none"
          checked={!!row.original.trend}
          disabled
        />
      ),
    },
    {
      accessorKey: "isRelated",
      header: "Related",
      cell: ({ row }) => (
        <Switch
          className="cursor-default pointer-events-none"
          checked={!!row.original.isRelated}
          disabled
        />
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) =>
        row.original.createdAt
          ? format(new Date(row.original.createdAt), "yyyy-MM-dd")
          : "-",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ProtectedComponent permissionKey={PERMISSION_KEYS.CATEGORIES.VIEW}>
            <Button variant="outline" asChild>
              <Link to={`../categories/${row.original._id}`}>
                <SquareArrowOutUpRightIcon className="w-4 h-4" /> View
              </Link>
            </Button>
          </ProtectedComponent>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-8 w-8 p-0">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-0" align="end">
              <ProtectedComponent
                permissionKey={PERMISSION_KEYS.CATEGORIES.UPDATE}
              >
                <Link to={`/dashboard/categories/update/${row.original._id}`}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-none px-3 py-2"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </Button>
                </Link>
              </ProtectedComponent>
              <ProtectedComponent
                permissionKey={PERMISSION_KEYS.CATEGORIES.DELETE}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-none px-3 py-2 text-destructive"
                  onClick={() =>
                    onOpen("deleteCategory", { id: row.original._id }, refetch)
                  }
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </Button>
              </ProtectedComponent>
            </PopoverContent>
          </Popover>
        </div>
      ),
    },
  ];
};
