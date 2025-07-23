import { MediaPreview } from "@/components/ui/media-preview";
import { type ColumnDef } from "@tanstack/react-table";
import { type FundTransaction } from "../types/fund-transaction.types";

export const useFundTransactionColumns = (): ColumnDef<FundTransaction>[] => [
  {
    accessorKey: "ticketNumber",
    header: "Contract Number",
    cell: ({ row }) => row.original.ticketNumber || "-",
  },
  {
    accessorKey: "fundAmount",
    header: "Fund Amount",
    cell: ({ row }) => row.original.fundAmount,
  },
  {
    accessorKey: "withdrawMethod",
    header: "Withdraw Method",
    cell: ({ row }) => row.original.withdrawMethod || "-",
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

    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MediaPreview
          src={row.original.user.profileImage}
          alt={row.original.user.name}
          className="w-8 h-8 rounded-full object-cover"
          preview
        />
        <div>
          <div className="font-medium">{row.original.user.name}</div>
          <div className="text-sm text-muted-foreground">
            @{row.original.user.username}
          </div>
        </div>
      </div>
    ),
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
];
