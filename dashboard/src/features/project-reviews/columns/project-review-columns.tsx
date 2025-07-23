import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useModal } from "@/store/modal-store";
import { type ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { type ProjectReview } from "../types/project-review.types";

export const useProjectReviewColumns = (
  refetch?: () => void
): ColumnDef<ProjectReview>[] => {
  const { onOpen } = useModal();
  return [
    //     status: boolean;
    // createdAt?: string;
    // updatedAt?: string;
    // user?: User;
    // project?: string;
    // cycle?: string;
    // rate?: number;
    // comment?: string;

    {
      accessorKey: "comment",
      header: "Comment",
      cell: ({ row }) => row.original.comment?.slice(0, 100) || "-",
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status ? "default" : "destructive"}>
          {row.original.status ? "Approved" : "Rejected"}
        </Badge>
      ),
    },
    {
      accessorKey: "rate",
      header: "Rate",
      cell: ({ row }) => row.original.rate || "-",
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
            <Link to={`../project-reviews/${row.original._id}`}>View</Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              onOpen("deleteProjectReview", { id: row.original._id }, refetch)
            }
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
};
