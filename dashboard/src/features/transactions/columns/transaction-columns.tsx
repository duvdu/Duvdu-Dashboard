import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { ExternalLinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { type Transaction } from "../types/transaction.types";

export const useTransactionColumns = (): ColumnDef<Transaction>[] => {
  return [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.type;
        const isSubscription = row.original.isSubscription;
        const finalType = isSubscription ? "Subscription" : type;
        const variant = type === "deposit" ? "default" : "secondary";
        return (
          <Badge className="truncate block max-w-xs" variant={variant}>
            {finalType}
          </Badge>
        );
      },
    },

    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => (
        <span className="truncate block max-w-xs">
          {row.original.user.name || "-"}
        </span>
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
      accessorKey: "contract",
      header: "Contract",
      cell: ({ row }) => (
        <Link
          to={`/dashboard/projects/${row.original.contract}`}
          className="truncate w-fit flex items-center gap-2 max-w-xs"
          target="_blank"
        >
          <Button variant="link" size="sm" className="p-0">
            {row.original.contract || "-"}
            <ExternalLinkIcon className="w-4 h-4" />
          </Button>
        </Link>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const variant =
          status === "success"
            ? "success"
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
    {
      accessorKey: "model",
      header: "Model",
      cell: ({ row }) => row.original.model || "-",
    },
  ];
};
