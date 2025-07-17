import { type ColumnDef } from "@tanstack/react-table";
import { type ContractRoot } from "../types/contract.types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const useContractColumns = (): ColumnDef<ContractRoot>[] => [
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const customer = row.original.customer;
      return (
        <span className="flex items-center  gap-3">
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
    accessorKey: "sp",
    header: "Service Provider",
    cell: ({ row }) => {
      const sp = row.original.sp;
      return (
        <span className="flex items-center  gap-3">
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.contract?.status;
      return (
        <Badge
          variant={
            status === "canceled"
              ? "destructive"
              : status === "ongoing"
              ? "default"
              : status === "pending"
              ? "outline"
              : status === "accepted"
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
    accessorKey: "contract.totalPrice",
    header: "Total Price",
    cell: ({ row }) =>
      row.original.contract.totalPrice
        ? row.original.contract.totalPrice.toLocaleString()
        : "-",
  },
  {
    accessorKey: "contract.appointmentDate",
    header: "Appointment Date",
    cell: ({ row }) =>
      row.original.contract.appointmentDate
        ? new Date(row.original.contract.appointmentDate).toLocaleDateString()
        : "-",
  },
  {
    accessorKey: "contract.deadline",
    header: "Deadline",
    cell: ({ row }) =>
      row.original.contract.deadline
        ? new Date(row.original.contract.deadline).toLocaleDateString()
        : "-",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) =>
      row.original.contract.createdAt
        ? new Date(row.original.contract.createdAt).toLocaleDateString()
        : "-",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
          <Link to={`../contracts/${row.original._id}`}>
            View
            <ExternalLink className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    ),
  },
];
