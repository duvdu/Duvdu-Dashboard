import { Button } from "@/components/ui/button";
import { useModal } from "@/store/modal-store";
import { type ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { type ContractReview } from "../types/types/contract-reviews.types";

export const useContractReviewColumns = (
  refetch?: () => void
): ColumnDef<ContractReview>[] => {
  const { onOpen } = useModal();
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => row.original.title.en,
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
            <Link to={`../contract-reviews/${row.original._id}`}>View</Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              onOpen("deleteContractReview", { id: row.original._id }, refetch)
            }
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
};
