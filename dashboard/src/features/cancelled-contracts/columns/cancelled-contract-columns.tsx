import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { type ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { type CancelledContract } from "../types/cancelled-contract.types";

export const useCancelledContractColumns =
  (): ColumnDef<CancelledContract>[] => [
    {
      accessorKey: "contract.customer",
      header: "Customer",
      cell: ({ row }) => {
        const customer = row.original.contract.customer;
        return (
          <span className="flex items-center gap-3">
            <Image src={customer.profileImage} alt={customer.name} />
            <div className="flex flex-col">
              <Link
                to={`/dashboard/users/${customer._id}`}
                target="_blank"
                className="font-medium text-base text-foreground truncate hover:underline hover:text-primary flex items-center gap-1"
              >
                {customer.name} <ExternalLink className="w-4 h-4" />
              </Link>
              <span className="text-xs text-muted-foreground">
                @{customer.username}
              </span>
            </div>
          </span>
        );
      },
    },
    {
      accessorKey: "contract.sp",
      header: "Service Provider",
      cell: ({ row }) => {
        const sp = row.original.contract.sp;
        return (
          <span className="flex items-center gap-3">
            <Image src={sp.profileImage} alt={sp.name} />
            <div className="flex flex-col">
              <Link
                to={`/dashboard/users/${sp._id}`}
                target="_blank"
                className="font-medium text-base text-foreground truncate hover:underline hover:text-primary flex items-center gap-1"
              >
                {sp.name} <ExternalLink className="w-4 h-4" />
              </Link>
              <span className="text-xs text-muted-foreground">
                @{sp.username}
              </span>
            </div>
          </span>
        );
      },
    },
    {
      accessorKey: "contract.contract.status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.contract.contract.status;
        return (
          <Badge
            variant={
              status === "canceled"
                ? "destructive"
                : status === "ongoing"
                ? "default"
                : status === "pending"
                ? "outline"
                : status === "accepted" || status === "completed"
                ? "success"
                : "secondary"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "contract.contract.totalPrice",
      header: "Total Price",
      cell: ({ row }) =>
        row.original.contract.contract.totalPrice
          ? row.original.contract.contract.totalPrice.toLocaleString()
          : "-",
    },
    {
      accessorKey: "contract.contract.deadline",
      header: "Deadline",
      cell: ({ row }) =>
        row.original.contract.contract.deadline
          ? new Date(
              row.original.contract.contract.deadline
            ).toLocaleDateString()
          : "-",
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
            <Link to={`../cancelled-contracts/${row.original._id}`}>
              View
              <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      ),
    },
  ];
