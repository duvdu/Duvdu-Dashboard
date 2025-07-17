import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { PERMISSION_KEYS } from "@/config/permissions";
import { useModal } from "@/store/modal-store";
import {
  Ban,
  BellIcon,
  Briefcase,
  CheckCircle,
  CircleDot,
  CircleOff,
  Eye,
  Mail,
  MapPin,
  MessageCircleIcon,
  Phone,
  Star,
  Trash2Icon,
  Users,
} from "lucide-react";
import { type FC } from "react";
import type { User } from "../types/user.types";

interface UserProfileHeaderProps {
  user: User;
  refetch?: () => void;
}

const UserProfileHeader: FC<UserProfileHeaderProps> = ({ user, refetch }) => {
  const { onOpen } = useModal();
  return (
    <div className="relative w-full rounded-lg shadow mb-4 overflow-hidden bg-white">
      {user.coverImage ? (
        <div className="h-36 w-full bg-gray-100 relative">
          <Image
            src={user.coverImage}
            alt="cover"
            className="w-full h-36 object-cover  rounded-t-lg rounded-b-none"
          />
        </div>
      ) : (
        <div className="h-36 w-full bg-gray-300  relative flex items-center justify-center">
          <span className="text-gray-500 text-sm">No cover image</span>
        </div>
      )}
      <div className="flex flex-col md:flex-row items-center gap-6 px-6 pb-6 pt-0 md:pt-6">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-600 border-4 border-white shadow-lg overflow-hidden">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt={user.name}
                preview
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            )}
            {user.isOnline && (
              <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            )}
            {user.isBlocked?.value && (
              <span className="absolute bottom-2 right-2 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
                <Ban className="w-3 h-3 text-white" />
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {user.name}
                {user.isVerified && (
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                )}
              </span>
              <span className="text-base text-gray-500">@{user.username}</span>
              {user.status && (
                <Badge
                  variant={
                    user.status === "active"
                      ? "default"
                      : user.status === "blocked"
                      ? "destructive"
                      : "secondary"
                  }
                  className="text-xs px-2 py-0.5"
                >
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Badge>
              )}
              {user.isAvaliableToInstantProjects && (
                <Badge
                  variant="success"
                  className="text-xs px-2 py-0.5 flex items-center gap-1"
                >
                  <CircleDot className="w-3 h-3" /> Available Now
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              {user.rate?.totalRates > 0 && (
                <span className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                  <Star className="w-4 h-4" />
                  {user.rate.totalRates.toFixed(1)}
                  <span className="text-gray-400">
                    ({user.rate.ratersCounter})
                  </span>
                </span>
              )}
              {user.profileViews !== undefined && (
                <span className="flex items-center gap-1 text-gray-500 text-sm">
                  <Eye className="w-4 h-4" /> {user.profileViews} views
                </span>
              )}
              {user.followCount && (
                <span className="flex items-center gap-1 text-gray-500 text-sm">
                  <Users className="w-4 h-4" /> {user.followCount.followers}{" "}
                  followers
                </span>
              )}
              {user.projectsCount !== undefined && (
                <span className="flex items-center gap-1 text-gray-500 text-sm">
                  <Briefcase className="w-4 h-4" /> {user.projectsCount}{" "}
                  projects
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-2">
              <span className="flex items-center gap-1 text-gray-600 text-sm">
                <Mail className="w-4 h-4" /> {user.email}
              </span>
              {user.phoneNumber?.number && (
                <span className="flex items-center gap-1 text-gray-600 text-sm">
                  <Phone className="w-4 h-4" /> {user.phoneNumber.number}
                </span>
              )}
              {typeof user.address === "string" && user.address && (
                <span className="flex items-center gap-1 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4" /> {user.address}
                </span>
              )}
            </div>
            {user.about && (
              <div className="mt-2 text-gray-700 text-sm line-clamp-2 max-w-2xl">
                {user.about}
              </div>
            )}
            <div className="flex items-center gap-2 mt-2">
              {user.rank && user.rank.title && (
                <span
                  className="text-xs font-semibold px-2 py-1 rounded"
                  style={{
                    background: user.rank.color || "#eee",
                    color: "#fff",
                  }}
                >
                  {user.rank.title}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Created:{" "}
              {user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
            </div>
          </div>
        </div>
      </div>
      {/* ACTION BAR */}
      <div className="flex flex-wrap gap-2 px-6 pb-4 border-t pt-4 bg-gray-50 justify-end">
        <ProtectedComponent permissionKey={PERMISSION_KEYS.NOTIFICATIONS.SEND}>
          <Button
            variant="outline"
            onClick={() =>
              onOpen("sendNotification", { users: [user._id] }, refetch)
            }
          >
            <BellIcon className="mr-2 h-4 w-4" /> Notify
          </Button>
        </ProtectedComponent>
        {/* <ProtectedComponent permissionKey={PERMISSION_KEYS.MESSAGES.SEND}> */}
        <Button
          variant="outline"
          onClick={() => onOpen("sendMessage", { receiver: user._id }, refetch)}
        >
          <MessageCircleIcon className="mr-2 h-4 w-4" /> Message
        </Button>
        {/* </ProtectedComponent> */}
        <ProtectedComponent
          permissionKeys={[
            PERMISSION_KEYS.USERS.BLOCK,
            PERMISSION_KEYS.USERS.UNBLOCK,
          ]}
        >
          <Button
            variant="outline"
            className="text-yellow-600"
            onClick={() =>
              onOpen(
                "blockUnblockUser",
                { userId: user._id, isBlocked: user.isBlocked.value },
                refetch
              )
            }
          >
            {user.isBlocked.value ? (
              <>
                <CircleOff className="mr-2 h-4 w-4" /> Unblock
              </>
            ) : (
              <>
                <Ban className="mr-2 h-4 w-4" /> Block
              </>
            )}
          </Button>
        </ProtectedComponent>
        <ProtectedComponent permissionKey={PERMISSION_KEYS.USERS.DELETE}>
          {!user.isDeleted && (
            <Button
              variant="destructive"
              onClick={() => onOpen("deleteUser", { id: user._id }, refetch)}
            >
              <Trash2Icon className="mr-2 h-4 w-4" /> Delete
            </Button>
          )}
        </ProtectedComponent>
      </div>
    </div>
  );
};

export default UserProfileHeader;
