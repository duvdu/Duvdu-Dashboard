import { lazy } from "react";
import { ChatMessagesView } from "./components/ChatMessagesView";

const ChatMainPage = lazy(() => import("./pages/chat-main-page"));
const UserToUserChatPage = lazy(() => import("./pages/user-to-user-chat-page"));

export const chatRoutes = [
  {
    path: "chat",
    element: <ChatMainPage />,
    children: [
      {
        path: ":userId",
        element: <ChatMessagesView />,
      },
    ],
  },
  {
    path: "chat/user-to-user",
    element: <UserToUserChatPage />,
  },
];
