import { Badge } from "@/components/ui/badge";
import { type ColumnDef } from "@tanstack/react-table";
import { type PayoutMethod } from "../types/payout-method.types";

export const payoutMethodColumns: ColumnDef<PayoutMethod>[] = [
  {
    accessorKey: "method",
    header: "Type",
    cell: ({ row }) =>
      row.original.method.charAt(0).toUpperCase() +
      row.original.method.slice(1),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "number",
    header: "Number",
    cell: ({ row }) => row.original.number,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isDeleted = row.original.isDeleted;
      const status = row.original.status;
      if (isDeleted) {
        return <Badge variant="destructive">Deleted</Badge>;
      }
      return (
        <Badge variant={status === "active" ? "default" : "destructive"}>
          {status === "active" ? "Active" : "Disabled"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "default",
    header: "Default",
    cell: ({ row }) => (
      <Badge variant={row.original.default ? "default" : "outline"}>
        {row.original.default ? "Yes" : "No"}
      </Badge>
    ),
  },
];
