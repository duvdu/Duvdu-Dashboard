import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useModal } from "@/store/modal-store";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Ban,
  BellIcon,
  CircleOff,
  MessageCircleIcon,
  MoreHorizontalIcon,
  PencilIcon,
  SquareArrowOutUpRightIcon,
} from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { type User } from "../types/user.types";

export const useUserColumns = (
  refetch: () => void,
  { isAdmin = false }: { isAdmin?: boolean } = {}
) => {
  const { onOpen } = useModal();

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          const name = row.original?.name || "--";
          const profileImage = row.original?.profileImage;
          const username = row.original?.username;
          return (
            <span className="flex items-center  gap-3">
              <Image src={profileImage} alt={name} />
              <div className="flex flex-col">
                <span className="font-medium text-base text-foreground truncate">
                  {name}
                </span>
                <span className="text-xs text-muted-foreground">
                  @{username}
                </span>
              </div>
            </span>
          );
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
          const email = row.original?.email || "--";
          return (
            <span className="text-sm text-foreground truncate">{email}</span>
          );
        },
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone",
        cell: ({ row }) => {
          const phone = row.original?.phoneNumber?.number || "--";
          return (
            <span className="text-sm text-foreground truncate">{phone}</span>
          );
        },
      },
      {
        accessorKey: "isBlocked",
        header: "Status",
        cell: ({ row }) => {
          const isBlocked = row.original?.isBlocked?.value || false;
          return (
            <Badge
              variant={isBlocked ? "destructive" : "default"}
              className="text-xs"
            >
              {isBlocked ? "Blocked" : "Active"}
            </Badge>
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
            {!isAdmin && (
              <Button variant="outline" asChild>
                <Link to={`../users/${row.original._id}`}>
                  View Profile
                  <SquareArrowOutUpRightIcon className="h-4 w-4" />
                </Link>
              </Button>
            )}

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-8 w-8 p-0">
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-0" align="end">
                {isAdmin ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-none px-3 py-2"
                    onClick={() => {
                      onOpen("updateAdmin", { id: row.original._id }, refetch);
                    }}
                  >
                    <PencilIcon className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-none px-3 py-2"
                      onClick={() => {
                        onOpen("sendNotification", {
                          users: [row.original._id],
                        });
                      }}
                    >
                      <BellIcon className="mr-2 h-4 w-4" />
                      Notify
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-none px-3 py-2"
                      onClick={() => {
                        onOpen("sendMessage", { receiver: row.original._id });
                      }}
                    >
                      <MessageCircleIcon className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  </>
                )}

                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-none px-3 py-2 text-destructive"
                  onClick={() => {
                    onOpen(
                      "blockUnblockUser",
                      {
                        userId: row.original._id,
                        isBlocked: row.original.isBlocked.value,
                      },
                      refetch
                    );
                  }}
                >
                  {row.original.isBlocked.value ? (
                    <>
                      <CircleOff className="mr-2 h-4 w-4" />
                      Unblock
                    </>
                  ) : (
                    <>
                      <Ban className="mr-2 h-4 w-4" />
                      Block
                    </>
                  )}
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        ),
      },
    ],
    [onOpen, refetch]
  );
  return columns;
};
