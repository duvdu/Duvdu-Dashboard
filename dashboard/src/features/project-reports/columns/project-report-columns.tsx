import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useModal } from "@/store/modal-store";
import { type ColumnDef } from "@tanstack/react-table";
import type { ProjectReport } from "../types/project-report.types";
import { MediaPreview } from "@/components/ui/media-preview";

export const useProjectReportColumns = (
  refetch?: () => void
): ColumnDef<ProjectReport>[] => {
  const { onOpen } = useModal();
  return [
    {
      accessorKey: "ticketNumber",
      header: "Ticket Number",
      cell: ({ row }) => row.original.ticketNumber,
    },
    {
      accessorKey: "desc",
      header: "Description",
      cell: ({ row }) => row.original.desc,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
    {
      id: "sourceUserDetails",
      header: "User",
      cell: ({ row }) => {
        const user = row.original.sourceUser;
        return (
          <div className="flex items-center gap-2">
            <MediaPreview
              src={user?.profileImage}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover"
              preview
            />
            <div>
              <div className="font-medium">{user?.name}</div>
              <div className="text-sm text-muted-foreground">
                @{user?.username}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "state.isClosed",
      header: "Status",
      cell: ({ row }) => {
        return row.original.state.isClosed ? (
          <Badge variant="destructive">Closed</Badge>
        ) : (
          <Badge variant="default">Open</Badge>
        );
      },
    },
    {
      id: "attachments",
      header: "Attachments",
      cell: ({ row }) => {
        const attachments = row.original.attachments || [];
        if (!attachments.length)
          return <span className="text-muted-foreground">No files</span>;
        return (
          <div className="flex items-center gap-2">
            <span>
              {attachments.length} file{attachments.length !== 1 ? "s" : ""}
            </span>
            {attachments.slice(0, 2).map((url, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary"
                download
              >
                View
              </a>
            ))}
            {attachments.length > 2 && (
              <span>+{attachments.length - 2} more</span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            onClick={() =>
              onOpen("deleteProjectReport", { id: row.original._id }, refetch)
            }
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
};
