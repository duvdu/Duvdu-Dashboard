import { lazy } from "react";
import { ChatMessagesView } from "./components/ChatMessagesView";

const ChatMainPage = lazy(() => import("./pages/chat-main-page"));

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
];
