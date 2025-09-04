import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";
import { PERMISSION_KEYS } from "@/config/permissions";
import { lazy } from "react";
import { ChatMessagesView } from "./components/ChatMessagesView";

const ChatMainPage = lazy(() => import("./pages/chat-main-page"));
const UserToUserChatPage = lazy(() => import("./pages/user-to-user-chat-page"));

export const chatRoutes = [
  {
    path: "messages",
    element: (
      <ProtectedRoute permissionKey={PERMISSION_KEYS.MESSAGES.VIEW}>
        <ChatMainPage />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ":userId",
        element: (
          <ProtectedRoute permissionKey={PERMISSION_KEYS.MESSAGES.VIEW}>
            <ChatMessagesView />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "user-to-user",
    element: (
      <ProtectedRoute permissionKey={PERMISSION_KEYS.MESSAGES.FROM_TO}>
        <UserToUserChatPage />
      </ProtectedRoute>
    ),
  },
];
