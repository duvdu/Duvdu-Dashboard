import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useModal } from "@/store/modal-store";
import { type ColumnDef } from "@tanstack/react-table";
import { ExternalLinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { ProjectReport } from "../types/project-report.types";

export const useProjectReportColumns = (
  refetch?: () => void
): ColumnDef<ProjectReport>[] => {
  const { onOpen } = useModal();
  return [
    {
      accessorKey: "sourceUser.name",
      header: "Source User",
      cell: ({ row }) => row.original.sourceUser.name,
    },
    {
      id: "project",
      accessorKey: "project.name",
      header: "Project",
      cell: ({ row }) => {
        const projectId = row.original.project?._id;
        return (
          <Link
            to={`/dashboard/projects/${projectId}`}
            target="_blank"
            className="flex items-center gap-2 hover:underline text-blue-500"
          >
            Go to project
            <ExternalLinkIcon className="w-4 h-4" />
          </Link>
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
