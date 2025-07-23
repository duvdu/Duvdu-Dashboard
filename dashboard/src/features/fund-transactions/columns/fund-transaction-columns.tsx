import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { type FundTransaction } from "../types/fund-transaction.types";

export const useFundTransactionColumns = (): ColumnDef<FundTransaction>[] => [
  {
    accessorKey: "fundAmount",
    header: "Fund Amount",
    cell: ({ row }) => row.original.fundAmount,
  },
  {
    accessorKey: "withdrawMethod",
    header: "Withdraw Method",
    cell: ({ row }) => row.original.withdrawMethod,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row.original.status,
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
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => row.original.user || "-",
  },
  {
    accessorKey: "fundAttachment",
    header: "Attachment",
    cell: ({ row }) =>
      row.original.fundAttachment ? (
        <a
          href={row.original.fundAttachment}
          target="_blank"
          rel="noopener noreferrer"
        >
          Download
        </a>
      ) : (
        "-"
      ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
          <Link to={`/dashboard/fund-transactions/${row.original._id}`}>
            View
          </Link>
        </Button>
      </div>
    ),
  },
];
