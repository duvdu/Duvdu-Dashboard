import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/features/transactions/types/transaction.types";
import { ExternalLinkIcon } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export const useSubscriptionColumns = (): ColumnDef<Transaction>[] => {
  return [
    {
      accessorKey: "ticketNumber",
      header: "Transaction Number",
      cell: ({ row }) => row.original?.ticketNumber || "-",
    },

    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => (
        <Link
          to={`/dashboard/users/${row.original.user?._id}`}
          className="truncate  max-w-xs flex items-center gap-2"
        >
          <Button variant="link" size="sm" className="p-0">
            {row.original.user?.name || "-"}
            <ExternalLinkIcon className="w-4 h-4" />
          </Button>
        </Link>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = row.original.amount;
        const currency = row.original.currency;
        return (
          <span className="truncate block max-w-xs">
            {amount} {currency}
          </span>
        );
      },
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const variant =
          status === "success"
            ? "success"
            : status === "funded"
            ? "default"
            : status === "failed"
            ? "destructive"
            : "secondary";
        return (
          <Badge className="truncate block max-w-xs" variant={variant}>
            {status}
          </Badge>
        );
      },
    },
  ];
};
