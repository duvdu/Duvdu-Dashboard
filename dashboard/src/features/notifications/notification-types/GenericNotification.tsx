import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import { type Notification } from "../store";
import { Image } from "@/components/ui/image";

export default function GenericNotification({
  notification,
}: {
  notification: Notification;
}) {
  const isUnread = !notification.watched;
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg transition-colors group ${
        isUnread ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"
      }`}
      style={{ textDecoration: "none" }}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-blue-200 overflow-hidden shadow-sm">
        <Image
          src={notification?.sourceUser?.profileImage || ""}
          alt={notification?.sourceUser?.name || "PP"}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-0.5">
          <Bell className="w-4 h-4 text-blue-500" />
          <span
            className={`font-semibold truncate ${
              isUnread ? "text-blue-900" : "text-gray-900"
            }`}
          >
            {notification.title}
          </span>
        </div>
        <div className="text-gray-700 text-sm truncate">
          {notification.message}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </div>
      </div>
    </div>
  );
}
