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
    accessorKey: "isDeleted",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.isDeleted ? "destructive" : "default"}>
        {row.original.isDeleted ? "Disabled" : "Active"}
      </Badge>
    ),
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
