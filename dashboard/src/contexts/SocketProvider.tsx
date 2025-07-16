import { useAuthStore } from "@/features/auth/store";
import type { Message } from "@/features/chat";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { type SocketContextValue } from "./SocketProvider.types";

const SocketContext = createContext<SocketContextValue>({ socket: null });

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user?._id) return;
    if (socketRef.current) return;
    // TODO: Replace with your backend socket URL
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

  // Global new_message handler for toast
  useEffect(() => {
    if (
      !socket ||
      !user?._id ||
      !location.pathname ||
      location.pathname.includes("/dashboard/chat/messages")
    )
      return;
    const handleNewMessage = (res: { data: Message }) => {
      const message = res.data;
      if (message.sourceUser?._id === user._id) return; // Ignore own messages
      const chatPath = `/dashboard/chat/messages/${message.sourceUser?._id}`;
      const isInChat = location.pathname === chatPath;
      if (!isInChat) {
        toast(
          `${
            message.sourceUser?.name || "New message"
          }: ${message.message.slice(0, 40)}`,
          {
            action: {
              label: "View",
              onClick: () => navigate(chatPath),
            },
            duration: 7000,
          }
        );
      }
    };
    socket.on("new_message", handleNewMessage);
    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, user?._id, location.pathname, navigate]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
