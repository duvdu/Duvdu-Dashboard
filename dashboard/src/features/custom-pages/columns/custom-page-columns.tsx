import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { type CustomPage } from "../types/custom-page.types";

export const useCustomPageColumns = (): ColumnDef<CustomPage>[] => [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="flex  gap-2">
        <p className="text-sm font-medium">{row.original.title?.en}</p>-
        <p className="text-sm font-medium">{row.original.title?.ar}</p>
      </div>
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
      <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
          <Link to={`../custom-pages/${row.original._id}`}>View</Link>
        </Button>
      </div>
    ),
  },
];
