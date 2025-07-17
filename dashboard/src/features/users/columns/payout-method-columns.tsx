import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PERMISSION_KEYS } from "@/config/permissions";
import { cn } from "@/lib/utils";
import { useModal } from "@/store/modal-store";
import { BanknoteIcon, WalletIcon } from "lucide-react";

export const usePayoutMethodColumns = () => {
  const { onOpen } = useModal();
  return [
    {
      accessorKey: "method",
      header: "Type",
      cell: ({ row }) => {
        const method = row.original.method as "wallet" | "bank";
        return (
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                method === "wallet"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              {method === "wallet" ? (
                <WalletIcon className="h-4 w-4" />
              ) : (
                <BanknoteIcon className="h-4 w-4" />
              )}
              {method}
            </Badge>
          </div>
        );
      },
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const isActive = row.original.status === "active";
        const isDeleted = row.original.isDeleted;
        if (isDeleted) return "--";
        return (
          <ProtectedComponent
            permissionKeys={[PERMISSION_KEYS.WITHDRAW_METHODS.UPDATE]}
          >
            <Button
              variant={"outline"}
              className={cn(
                isActive && "border-destructive text-destructive",
                !isActive && "border-primary text-primary"
              )}
              onClick={() =>
                onOpen("activateDeactivatePayoutMethod", {
                  payoutMethodId: row.original._id,
                  status: row.original.status,
                })
              }
            >
              {isActive ? "Deactivate" : "Activate"}
            </Button>
          </ProtectedComponent>
        );
      },
    },
  ];
};
