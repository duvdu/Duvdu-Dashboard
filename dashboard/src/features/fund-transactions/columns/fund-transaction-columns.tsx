import { MediaPreview } from "@/components/ui/media-preview";
import { type ColumnDef } from "@tanstack/react-table";
import { type FundTransaction } from "../types/fund-transaction.types";
import { useModal } from "@/store/modal-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PERMISSION_KEYS } from "@/config/permissions";
import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";

export const useFundTransactionColumns = (): ColumnDef<FundTransaction>[] => {
  const { onOpen } = useModal();
  return [
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
      cell: ({ row }) => row.original.withdrawMethod?.name || "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "success" ? "default" : "outline"}
        >
          {row.original.status}
        </Badge>
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) =>
        row.original.status === "pending" ? (
          <ProtectedComponent
            permissionKeys={[PERMISSION_KEYS.FUND_TRANSACTIONS.UPDATE]}
          >
            <Button
              size="sm"
              variant="default"
              onClick={() =>
              onOpen("closeFundTransaction", {
                id: row.original._id,
                userId: row.original.user._id,
                withdrawMethodId: row.original?.withdrawMethod?._id,
                fundAmount: row.original.fundAmount,
              })
            }
          >
              Close
            </Button>
          </ProtectedComponent>
        ) : null,
    },
  ];
};
