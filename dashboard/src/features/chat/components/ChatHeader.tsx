import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MediaPreview } from "@/components/ui/media-preview";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { PERMISSION_KEYS } from "@/config/permissions";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ArchiveIcon,
  ArrowLeftIcon,
  DownloadIcon,
  MoreVerticalIcon,
  PinIcon,
  TrashIcon,
  UserIcon,
  VolumeXIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { type Chat, type User } from "../types/chat.types";

interface ChatHeaderProps {
  chat: Chat;
  otherParticipant: User;
  onArchive?: () => void;
  onPin?: () => void;
  onMute?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
  className?: string;
}

export function ChatHeader({
  chat,
  otherParticipant,
  onArchive,
  onPin,
  onMute,
  onDelete,
  onExport,
  className,
}: ChatHeaderProps) {
  const getParticipantStatus = (participant: User) => {
    if (participant.isOnline) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm">Online</span>
        </div>
      );
    }

    if (participant.lastSeen) {
      return (
        <div className="text-sm text-muted-foreground">
          Last seen {format(new Date(participant.lastSeen), "MMM dd, HH:mm")}
        </div>
      );
    }

    return <div className="text-sm text-muted-foreground">Offline</div>;
  };

  const getChatBadges = () => {
    const badges = [];

    if (chat.isPinned) {
      badges.push(
        <Badge key="pinned" variant="secondary" className="text-xs">
          <PinIcon className="w-3 h-3 mr-1" />
          Pinned
        </Badge>
      );
    }

    if (chat.isArchived) {
      badges.push(
        <Badge key="archived" variant="outline" className="text-xs">
          <ArchiveIcon className="w-3 h-3 mr-1" />
          Archived
        </Badge>
      );
    }

    if (chat.mutedUntil && new Date(chat.mutedUntil) > new Date()) {
      badges.push(
        <Badge key="muted" variant="destructive" className="text-xs">
          <VolumeXIcon className="w-3 h-3 mr-1" />
          Muted
        </Badge>
      );
    }

    if (chat.unreadCount > 0) {
      badges.push(
        <Badge key="unread" variant="default" className="bg-blue-500 text-xs">
          {chat.unreadCount} unread
        </Badge>
      );
    }

    return badges;
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 border-b",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 lg:hidden"
          asChild
        >
          <Link to="/dashboard/chat">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>

        {/* Participant Info */}
        <div className="flex items-center gap-3">
          <MediaPreview
            src={otherParticipant.profileImage}
            alt={otherParticipant.name}
            className="w-10 h-10 rounded-full object-cover"
          />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold truncate">
                {otherParticipant.name}
              </h2>
              {otherParticipant.hasVerificationBadge && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                @{otherParticipant.username}
              </span>
              {getParticipantStatus(otherParticipant)}
            </div>
          </div>
        </div>

        {/* Chat Status Badges */}
        <div className="flex items-center gap-2">{getChatBadges()}</div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Quick Actions */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hidden sm:flex"
          asChild
        >
          <Link to={`/dashboard/users/${otherParticipant._id}`}>
            <UserIcon className="h-4 w-4" />
          </Link>
        </Button>

        {/* More Actions */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="end">
            <div className="py-2">
              <Link to={`/dashboard/users/${otherParticipant._id}`}>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 h-auto"
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </Link>

              <Separator className="my-1" />

              <ProtectedComponent
                permissionKey={PERMISSION_KEYS.MESSAGES.MANAGE}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 h-auto"
                  onClick={onPin}
                >
                  <PinIcon className="w-4 h-4 mr-2" />
                  {chat.isPinned ? "Unpin Chat" : "Pin Chat"}
                </Button>
              </ProtectedComponent>

              <ProtectedComponent
                permissionKey={PERMISSION_KEYS.MESSAGES.MANAGE}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 h-auto"
                  onClick={onArchive}
                >
                  <ArchiveIcon className="w-4 h-4 mr-2" />
                  {chat.isArchived ? "Unarchive Chat" : "Archive Chat"}
                </Button>
              </ProtectedComponent>

              <ProtectedComponent
                permissionKey={PERMISSION_KEYS.MESSAGES.MANAGE}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 h-auto"
                  onClick={onMute}
                >
                  <VolumeXIcon className="w-4 h-4 mr-2" />
                  {chat.mutedUntil && new Date(chat.mutedUntil) > new Date()
                    ? "Unmute Chat"
                    : "Mute Chat"}
                </Button>
              </ProtectedComponent>

              <ProtectedComponent
                permissionKey={PERMISSION_KEYS.MESSAGES.MANAGE}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 h-auto"
                  onClick={onExport}
                >
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Export Chat
                </Button>
              </ProtectedComponent>

              <Separator className="my-1" />

              <ProtectedComponent
                permissionKey={PERMISSION_KEYS.MESSAGES.MANAGE}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 h-auto text-destructive hover:text-destructive"
                  onClick={onDelete}
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Delete Chat
                </Button>
              </ProtectedComponent>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
