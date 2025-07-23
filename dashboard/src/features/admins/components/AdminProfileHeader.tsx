import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { PERMISSION_KEYS } from "@/config/permissions";
import { useModal } from "@/store/modal-store";
import {
  Ban,
  BellIcon,
  CheckCircle,
  CircleDot,
  CircleOff,
  Eye,
  Mail,
  MessageCircleIcon,
  PencilIcon,
  Phone,
  Shield,
  Trash2Icon,
  Users,
} from "lucide-react";
import { type FC } from "react";
import { type User } from "../../users/types/user.types";

interface AdminProfileHeaderProps {
  admin: User;
  refetch?: () => void;
}

const AdminProfileHeader: FC<AdminProfileHeaderProps> = ({
  admin,
  refetch,
}) => {
  const { onOpen } = useModal();

  return (
    <div className="relative w-full rounded-lg shadow mb-4 overflow-hidden bg-card text-card-foreground">
      {admin.coverImage ? (
        <div className="h-36 w-full bg-muted relative">
          <Image
            src={admin.coverImage}
            alt="cover"
            className="w-full h-36 object-cover rounded-t-lg rounded-b-none"
          />
        </div>
      ) : (
        <div className="h-36 w-full bg-muted relative flex items-center justify-center">
          <span className="text-muted-foreground text-sm">No cover image</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center gap-6 px-6 pb-6 pt-0 md:pt-6">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center text-4xl font-bold text-muted-foreground border-4 border-background shadow-lg overflow-hidden">
            {admin.profileImage ? (
              <Image
                src={admin.profileImage}
                alt={admin.name}
                preview
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              admin.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            )}
            {admin.isOnline && (
              <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
            )}
            {admin.isBlocked?.value && (
              <span className="absolute bottom-2 right-2 w-4 h-4 bg-destructive border-2 border-background rounded-full flex items-center justify-center">
                <Ban className="w-3 h-3 text-white" />
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl font-bold text-foreground flex items-center gap-2">
                {admin.name}
                {admin.isVerified && (
                  <CheckCircle className="w-5 h-5 text-primary" />
                )}
              </span>
              <span className="text-base text-muted-foreground">
                @{admin.username}
              </span>
              <Badge
                variant="default"
                className="text-xs px-2 py-0.5 bg-primary"
              >
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
              {admin.isBlocked?.value ? (
                <Badge variant="destructive" className="text-xs px-2 py-0.5">
                  Blocked
                </Badge>
              ) : admin.isDeleted ? (
                <Badge variant="destructive" className="text-xs px-2 py-0.5">
                  Deleted
                </Badge>
              ) : (
                <Badge variant="default" className="text-xs px-2 py-0.5">
                  Active
                </Badge>
              )}
              {admin.isOnline && (
                <Badge
                  variant="success"
                  className="text-xs px-2 py-0.5 flex items-center gap-1 bg-green-100 text-green-800"
                >
                  <CircleDot className="w-3 h-3" /> Online
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap mt-2">
              <span className="flex items-center gap-1 text-muted-foreground text-sm">
                <Mail className="w-4 h-4" /> {admin.email}
              </span>
              {admin.phoneNumber?.number && (
                <span className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Phone className="w-4 h-4" /> {admin.phoneNumber.number}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap mt-1">
              {admin.profileViews !== undefined && (
                <span className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Eye className="w-4 h-4" /> {admin.profileViews} views
                </span>
              )}
              {admin.followCount && (
                <span className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Users className="w-4 h-4" /> {admin.followCount.followers}{" "}
                  followers
                </span>
              )}
            </div>

            {admin.about && (
              <div className="mt-2 text-foreground text-sm line-clamp-2 max-w-2xl">
                {admin.about}
              </div>
            )}

            <div className="text-xs text-muted-foreground mt-2">
              Created:{" "}
              {admin.createdAt
                ? new Date(admin.createdAt).toLocaleString()
                : "-"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-6 pb-4 border-t pt-4 bg-card justify-end">
        <ProtectedComponent permissionKey={PERMISSION_KEYS.ADMINS.UPDATE}>
          <Button
            variant="outline"
            onClick={() => onOpen("updateAdmin", { id: admin._id }, refetch)}
          >
            <PencilIcon className="mr-2 h-4 w-4" /> Edit Admin
          </Button>
        </ProtectedComponent>

        <ProtectedComponent permissionKey={PERMISSION_KEYS.NOTIFICATIONS.SEND}>
          <Button
            variant="outline"
            onClick={() =>
              onOpen("sendNotification", { users: [admin._id] }, refetch)
            }
          >
            <BellIcon className="mr-2 h-4 w-4" /> Notify
          </Button>
        </ProtectedComponent>

        <Button
          variant="outline"
          onClick={() =>
            onOpen("sendMessage", { receiver: admin._id }, refetch)
          }
        >
          <MessageCircleIcon className="mr-2 h-4 w-4" /> Message
        </Button>

        <ProtectedComponent
          permissionKeys={[
            PERMISSION_KEYS.ADMINS.BLOCK,
            PERMISSION_KEYS.ADMINS.UNBLOCK,
          ]}
        >
          <Button
            variant="outline"
            className="text-yellow-600"
            onClick={() =>
              onOpen(
                "blockUnblockUser",
                { userId: admin._id, isBlocked: admin.isBlocked.value },
                refetch
              )
            }
          >
            {admin.isBlocked.value ? (
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

        <ProtectedComponent permissionKey={PERMISSION_KEYS.ADMINS.DELETE}>
          {!admin.isDeleted && (
            <Button
              variant="destructive"
              onClick={() => onOpen("deleteUser", { id: admin._id }, refetch)}
            >
              <Trash2Icon className="mr-2 h-4 w-4" /> Delete
            </Button>
          )}
        </ProtectedComponent>
      </div>
    </div>
  );
};

export default AdminProfileHeader;
