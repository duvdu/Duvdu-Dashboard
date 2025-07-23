import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { type ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { type Complaint } from "../types/complaint.types";

export const useComplaintColumns = (): ColumnDef<Complaint>[] => [
  {
    accessorKey: "ticketNumber",
    header: "Ticket Number",
    cell: ({ row }) => row.original.ticketNumber || "--",
  },
  {
    accessorKey: "reporter",
    header: "Reporter",
    cell: ({ row }) => {
      const reporter = row.original.reporter;
      return (
        <span className="flex items-center gap-3">
          <Image src={reporter.profileImage} alt={reporter.name} />
          <div className="flex flex-col">
            <Link
              to={`/dashboard/users/${reporter._id}`}
              target="_blank"
              className="font-medium text-base text-foreground truncate hover:underline hover:text-primary flex items-center gap-1"
            >
              {reporter.name} <ExternalLink className="w-4 h-4" />
            </Link>
            <span className="text-xs text-muted-foreground">
              @{reporter.username}
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
      const isClosed = !!row.original.closedBy;
      return (
        <Badge variant={isClosed ? "secondary" : "destructive"}>
          {isClosed ? "Closed" : "Open"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "attachments",
    header: "Attachments",
    cell: ({ row }) => {
      const attachmentCount = row.original.attachments?.length || 0;
      return (
        <span className="text-sm text-muted-foreground">
          {attachmentCount} file{attachmentCount !== 1 ? "s" : ""}
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
          <Link to={`/dashboard/complaints/${row.original._id}`}>
            View
            <ExternalLink className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    ),
  },
];
