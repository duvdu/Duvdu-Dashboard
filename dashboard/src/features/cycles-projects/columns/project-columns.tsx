import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MediaPreview } from "@/components/ui/media-preview";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useModal } from "@/store/modal-store";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ExternalLink,
  Globe,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getProjectPublicUrl } from "../api/project.api";
import { type Project } from "../types/project.types";
import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import { PERMISSION_KEYS } from "@/config/permissions";

export const useProjectColumns = (
  refetch?: () => void
): ColumnDef<Project>[] => {
  const { onOpen } = useModal();

  return [
    {
      accessorKey: "cover",
      header: "Cover",
      cell: ({ row }) => (
        <MediaPreview
          src={row.original.cover}
          alt={row.original.name}
          className="w-12 h-12 rounded-md object-cover"
          preview
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Title",
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <div className="font-medium truncate">{row.original.name}</div>
          <div className="text-sm text-muted-foreground truncate">
            {row.original.description}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "user",
      header: "Creator",
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
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.original.category.title as unknown as string}
          </div>
          {row.original.subCategory?.title && (
            <div className="text-sm text-muted-foreground">
              {row.original.subCategory.title as unknown as string}
            </div>
          )}
        </div>
      ),
    },
    // {
    //   accessorKey: "status",
    //   header: "Status",
    //   cell: ({ row }) => getStatusBadge(row.original.status || "pending"),
    // },
    {
      accessorKey: "projectsView",
      header: "Views",
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.views || row.original.user.projectsView || 0}
        </div>
      ),
    },
    {
      accessorKey: "bookings",
      header: "Bookings",
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.bookings ||
            row.original.user.acceptedProjectsCounter ||
            0}
        </div>
      ),
    },
    {
      accessorKey: "favouriteCount",
      header: "Likes",
      cell: ({ row }) => (
        <div className="text-center">{row.original.favouriteCount}</div>
      ),
    },
    {
      accessorKey: "isDeleted",
      header: "Deleted",
      cell: ({ row }) => (
        <Badge variant={row.original.isDeleted ? "destructive" : "outline"}>
          {row.original.isDeleted ? "Deleted" : "Active"}
        </Badge>
      ),
    },
    {
      accessorKey: "showOnHome",
      header: "Show on Home",
      cell: ({ row }) => (
        <Badge variant={row.original.showOnHome ? "default" : "outline"}>
          {row.original.showOnHome ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) =>
        format(new Date(row.original.createdAt), "MMM dd, yyyy"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const project = row.original;

        return (
          <div className="flex items-center gap-2">
            {/* View Public Version */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="h-8" asChild>
                  <Link
                    to={getProjectPublicUrl(project._id)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Public Version</TooltipContent>
            </Tooltip>

            <Button variant="outline" asChild>
              <Link to={`/dashboard/projects/${project._id}`}>
                View <ExternalLink className="h-4 w-4 " />
              </Link>
            </Button>

            {/* More Actions */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0" align="end">
                <ProtectedComponent
                  permissionKeys={[PERMISSION_KEYS.PROJECTS.UPDATE]}
                >
                  <Link to={`/dashboard/projects/${project._id}/update`}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-none px-3 py-2"
                    >
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                </ProtectedComponent>

                <ProtectedComponent
                  permissionKeys={[PERMISSION_KEYS.PROJECTS.DELETE]}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-none px-3 py-2 text-destructive"
                    onClick={() =>
                      onOpen("deleteProject", { id: project._id }, refetch)
                    }
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </ProtectedComponent>
              </PopoverContent>
            </Popover>
          </div>
        );
      },
    },
  ];
};
