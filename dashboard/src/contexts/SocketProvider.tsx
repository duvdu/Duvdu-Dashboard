import ChatMessagePopup from "@/components/ChatMessagePopup";
import { useAuthStore } from "@/features/auth/store";
import { getOtherUser } from "@/features/chat/utils";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { SocketContext } from "./SocketProvider.types";

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [newMessagePopup, setNewMessagePopup] = useState<{
    senderName: string;
    messagePreview: string;
    chatPath: string;
  } | null>(null);
  const [addNotification, setAddNotification] = useState<
    ((notification: any) => void) | null
  >(null);
  const [newNotificationPopup, setNewNotificationPopup] = useState<{
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!user?._id) return;
    if (socketRef.current) return;
    const s = io(import.meta.env.VITE_API_URL, {
      query: { userId: user._id },
      autoConnect: true,
      transports: ["websocket"],
    });
    socketRef.current = s;
    setSocket(s);
    return () => {
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [user?._id]);

  useEffect(() => {
    if (!socket || !user?._id) return;
    const handleNewMessage = (res: { message: any }) => {
      const message = res.message;
      const otherUser = getOtherUser(user?._id, message);
      if (!otherUser || otherUser._id === user?._id) return;
      const chatPath = `/dashboard/chat/messages/${otherUser._id}`;
      const isInChat = location.pathname === chatPath;
      if (!isInChat) {
        setNewMessagePopup({
          senderName: otherUser.name || "New message",
          messagePreview: message.content.slice(0, 40),
          chatPath,
        });

        setTimeout(() => {
          setNewMessagePopup(null);
        }, 5000);
      }
    };
    socket.on("new_message", handleNewMessage);
    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, user?._id, location.pathname, navigate]);

  useEffect(() => {
    import("@/features/notifications/store").then((mod) => {
      setAddNotification(
        () => mod.useNotificationsStore.getState().addNotification
      );
    });
  }, []);

  useEffect(() => {
    if (!socket || !user?._id || !addNotification) return;
    const handleNewNotification = (res: { notification: any }) => {
      addNotification(res.notification);
      setNewNotificationPopup({
        title: res.notification.title,
        message: res.notification.message,
      });
      setTimeout(() => {
        setNewNotificationPopup(null);
      }, 5000);
    };
    socket.on("notification", handleNewNotification);
    return () => {
      socket.off("notification", handleNewNotification);
    };
  }, [socket, user?._id, addNotification]);

  const handleViewMessage = () => {
    if (newMessagePopup) {
      navigate(newMessagePopup.chatPath);
      setNewMessagePopup(null);
    }
  };
  const handleClosePopup = () => {
    setNewMessagePopup(null);
  };

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
      <ChatMessagePopup
        open={!!newMessagePopup}
        senderName={newMessagePopup?.senderName || ""}
        messagePreview={newMessagePopup?.messagePreview || ""}
        onView={handleViewMessage}
        onClose={handleClosePopup}
      />
      {/* Notification Popup */}
      {newNotificationPopup && (
        <div className="fixed top-4 right-4 z-50 bg-white shadow-lg rounded-lg p-4 border border-gray-200">
          <div className="font-semibold mb-1">{newNotificationPopup.title}</div>
          <div className="text-gray-700 mb-2">
            {newNotificationPopup.message}
          </div>
        </div>
      )}
    </SocketContext.Provider>
  );
}
