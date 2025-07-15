import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
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
import { PERMISSION_KEYS } from "@/config/permissions";
import { useModal } from "@/store/modal-store";
import { type ColumnDef } from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";
import {
  ArchiveIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  PinIcon,
  TrashIcon,
  UserIcon,
  VolumeXIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { type Chat } from "../types/chat.types";

export const useChatColumns = (refetch?: () => void): ColumnDef<Chat>[] => {
  const { onOpen } = useModal();

  const getParticipantsList = (participants: Chat["participants"]) => {
    if (participants?.length === 1) {
      return participants?.[0]?.name || "Unknown";
    }
    return participants?.map((p) => p.name).join(", ");
  };

  const getLastMessagePreview = (lastMessage?: Chat["lastMessage"]) => {
    if (!lastMessage) return "No messages";

    const preview = lastMessage?.attachments?.length
      ? `📎 ${lastMessage?.attachments?.length} attachment${
          lastMessage.attachments?.length > 1 ? "s" : ""
        }`
      : lastMessage?.content;

    return preview?.length > 50 ? `${preview?.substring(0, 50)}...` : preview;
  };

  const getStatusBadge = (chat: Chat) => {
    const badges = [];

    if (chat?.isPinned) {
      badges.push(
        <Badge key="pinned" variant="secondary">
          Pinned
        </Badge>
      );
    }

    if (chat.isArchived) {
      badges.push(
        <Badge key="archived" variant="outline">
          Archived
        </Badge>
      );
    }

    if (chat.mutedUntil) {
      const isMuted = new Date(chat.mutedUntil) > new Date();
      if (isMuted) {
        badges.push(
          <Badge key="muted" variant="destructive">
            Muted
          </Badge>
        );
      }
    }

    if (chat.unreadCount > 0) {
      badges.push(
        <Badge key="unread" variant="default" className="bg-blue-500">
          {chat.unreadCount} unread
        </Badge>
      );
    }

    return badges?.length > 0 ? (
      <div className="flex flex-wrap gap-1">{badges}</div>
    ) : (
      <Badge variant="outline" className="text-green-600">
        Active
      </Badge>
    );
  };

  return [
    {
      accessorKey: "participants",
      header: "Participants",
      cell: ({ row }) => {
        const participants = row.original.participants;

        return (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {participants?.slice(0, 3).map((participant, index) => (
                <MediaPreview
                  key={participant._id}
                  src={participant.profileImage}
                  alt={participant.name}
                  className={`w-8 h-8 rounded-full object-cover border-2 border-white ${
                    index > 0 ? "ml-0" : ""
                  }`}
                  preview
                />
              ))}
              {participants?.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                  +{participants?.length - 3}
                </div>
              )}
            </div>
            <div>
              <div className="font-medium">
                {getParticipantsList(participants)}
              </div>
              <div className="text-sm text-muted-foreground">
                {participants?.length === 1
                  ? "@" + participants?.[0]?.username
                  : `${participants?.length} participants`}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "lastMessage",
      header: "Last Message",
      cell: ({ row }) => {
        const lastMessage = row.original.lastMessage;

        return (
          <div className="max-w-[250px]">
            <div className="text-sm text-muted-foreground truncate">
              {lastMessage?.sender ? (
                <span className="font-medium">{lastMessage.sender.name}: </span>
              ) : null}
              {getLastMessagePreview(lastMessage)}
            </div>
            {lastMessage && (
              <div className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(lastMessage.createdAt), {
                  addSuffix: true,
                })}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original),
    },
    {
      accessorKey: "unreadCount",
      header: "Unread",
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.unreadCount > 0 ? (
            <Badge variant="default" className="bg-blue-500">
              {row.original.unreadCount}
            </Badge>
          ) : (
            <span className="text-muted-foreground">0</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Last Activity",
      cell: ({ row }) => (
        <div className="text-sm">
          <div>{format(new Date(row.original.updatedAt), "MMM dd, yyyy")}</div>
          <div className="text-muted-foreground">
            {format(new Date(row.original.updatedAt), "HH:mm")}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <div className="text-sm">
          {format(new Date(row.original.createdAt), "MMM dd, yyyy")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const chat = row.original;
        const primaryParticipant = chat.participants?.[0];

        return (
          <div className="flex items-center gap-2">
            {/* Quick Actions */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="h-8" asChild>
                  <Link to={`/dashboard/chat/${primaryParticipant._id}`}>
                    <MessageSquareIcon className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open Chat</TooltipContent>
            </Tooltip>

            {/* More Actions */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0" align="end">
                <Link to={`/dashboard/chat/${primaryParticipant._id}`}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-none px-3 py-2"
                  >
                    <MessageSquareIcon className="w-4 h-4 mr-2" />
                    View Chat
                  </Button>
                </Link>

                <Link to={`/dashboard/users/${primaryParticipant._id}`}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-none px-3 py-2"
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                </Link>

                <ProtectedComponent
                  permissionKey={PERMISSION_KEYS.MESSAGES.MANAGE}
                  fallback={null}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-none px-3 py-2"
                    onClick={() =>
                      onOpen(
                        "pinChat",
                        { chatId: chat._id, isPinned: !chat.isPinned },
                        refetch
                      )
                    }
                  >
                    <PinIcon className="w-4 h-4 mr-2" />
                    {chat.isPinned ? "Unpin" : "Pin"}
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-none px-3 py-2"
                    onClick={() =>
                      onOpen(
                        "archiveChat",
                        { chatId: chat._id, isArchived: !chat.isArchived },
                        refetch
                      )
                    }
                  >
                    <ArchiveIcon className="w-4 h-4 mr-2" />
                    {chat.isArchived ? "Unarchive" : "Archive"}
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-none px-3 py-2"
                    onClick={() =>
                      onOpen("muteChat", { chatId: chat._id }, refetch)
                    }
                  >
                    <VolumeXIcon className="w-4 h-4 mr-2" />
                    Mute
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-none px-3 py-2 text-destructive"
                    onClick={() =>
                      onOpen(
                        "deleteChat",
                        { chatId: chat._id, userId: primaryParticipant._id },
                        refetch
                      )
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
