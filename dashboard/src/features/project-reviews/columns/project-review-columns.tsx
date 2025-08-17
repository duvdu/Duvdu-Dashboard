import { type ColumnDef } from "@tanstack/react-table";
import { type ProjectReview } from "../types/project-review.types";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaPreview } from "@/components/ui/media-preview";

export const useProjectReviewColumns = (): ColumnDef<ProjectReview>[] => {
  return [
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
      accessorKey: "comment",
      header: "Comment",
      cell: ({ row }) => row.original.comment?.slice(0, 100) || "-",
    },

    {
      accessorKey: "rate",
      header: "Rate",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={cn(
                row.original.rate >= index + 1
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300"
              )}
            />
          ))}
        </div>
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
    // {
    //   id: "actions",
    //   header: "Actions",
    //   cell: ({ row }) => (
    //     <div className="flex items-center gap-2">
    //       <Button variant="outline" asChild>
    //         <Link to={`../project-reviews/${row.original._id}`}>View</Link>
    //       </Button>
    //       <Button
    //         variant="destructive"
    //         onClick={() =>
    //           onOpen("deleteProjectReview", { id: row.original._id }, refetch)
    //         }
    //       >
    //         Delete
    //       </Button>
    //     </div>
    //   ),
    // },
  ];
};
