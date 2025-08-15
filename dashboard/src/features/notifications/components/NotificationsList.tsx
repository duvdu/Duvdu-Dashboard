import { CheckCircle, Inbox } from "lucide-react";
import { useEffect } from "react";
import { getNotifications } from "../api/notification.api";
import {
  ComplaintNotification,
  GenericNotification,
  TagNotification,
} from "../notification-types";
import { useNotificationsStore, type Notification } from "../store";
import { useInfiniteQuery } from "@/hooks/useInfiniteQuery";

function NotificationItem({ notification }: { notification: Notification }) {
  switch (notification.type) {
    case "complaint":
      return <ComplaintNotification notification={notification} />;
    case "new tag":
      return <TagNotification notification={notification} />;
    default:
      return <GenericNotification notification={notification} />;
  }
}

export default function NotificationsList() {
  const { notifications, setNotifications, resetUnread, unreadCount } =
    useNotificationsStore();

  const {
    data,
    isLoading,
    isLoadingMore,
    hasMore,
    observerRef: loadMoreRef,
  } = useInfiniteQuery<Notification>({
    queryFn: ({ page, pageSize }) => getNotifications({ page, pageSize }),
    pageSize: 10,
    enabled: true,
    queryParams: {
      page: 1,
    },
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const allNotifications = data;
      setNotifications(allNotifications);
    }
  }, [data, setNotifications]);

  const unread = notifications.filter((n) => !n?.watched);
  const read = notifications.filter((n) => n?.watched);

  return (
    <div className="max-h-[500px] overflow-y-auto w-[400px] p-2 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 transition-all">
      <div className="flex items-center justify-between mb-2">
        {unreadCount > 0 && (
          <button
            className="flex items-center gap-1 text-xs text-primary hover:underline px-2 py-1 rounded"
            onClick={resetUnread}
          >
            <CheckCircle className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse h-16 bg-secondary rounded-lg"
            />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <Inbox className="w-10 h-10 mb-2" />
          <span>No notifications yet</span>
        </div>
      ) : (
        <>
          {unread.length > 0 && (
            <div className="mb-1">
              <div className="text-xs text-muted-foreground mb-1 ml-1">New</div>
              <div className="space-y-1">
                {unread.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                  />
                ))}
              </div>
            </div>
          )}
          {read.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-muted-foreground mb-1 ml-1">
                Earlier
              </div>
              <div className="space-y-1">
                {read.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={loadMoreRef} />
          {isLoadingMore && (
            <div className="p-2 text-center text-xs text-muted-foreground">
              Loading...
            </div>
          )}
          {!hasMore && notifications.length > 0 && (
            <div className="p-2 text-center text-xs text-muted-foreground">
              No more notifications
            </div>
          )}
        </>
      )}
    </div>
  );
}
