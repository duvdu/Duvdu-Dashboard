import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useModal } from "@/store/modal-store";
import { type ColumnDef } from "@tanstack/react-table";
import { ExternalLinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { type Transaction } from "../types/transaction.types";

export const useTransactionColumns = (): ColumnDef<Transaction>[] => {
  const { onOpen } = useModal();
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
      accessorKey: "fundingAmount",
      header: "Funded Amount",
      cell: ({ row }) => {
        const fundingAmount = row.original.fundingAmount;
        const currency = row.original.currency;
        return (
          <span className="truncate block max-w-xs">
            {fundingAmount} {currency}
          </span>
        );
      },
    },
    {
      accessorKey: "contract",
      header: "Contract",
      cell: ({ row }) => (
        <Link
          to={`/dashboard/contracts/${row.original.contract}`}
          className="truncate w-fit flex items-center gap-2 max-w-xs"
          target="_blank"
        >
          <Button variant="link" size="sm" className="p-0">
            View
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const status = row.original.status;
        if (status !== "success") return "--";
        return (
          <Button
            variant="default"
            size="sm"
            onClick={() =>
              onOpen("fundTransaction", {
                id: row.original._id,
                amount: row.original.amount,
              })
            }
          >
            Fund
          </Button>
        );
      },
    },
  ];
};
