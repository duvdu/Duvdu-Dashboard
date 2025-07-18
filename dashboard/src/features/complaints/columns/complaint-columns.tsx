import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { type Complaint } from "../types/complaint.types";

export const useComplaintColumns = (): ColumnDef<Complaint>[] => [
  {
    accessorKey: "complaint",
    header: "Complaint",
    cell: ({ row }) => row.original.contract,
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
          <Link to={`../complaints/${row.original._id}`}>View</Link>
        </Button>
      </div>
    ),
  },
];
