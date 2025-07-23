import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { ChatSidebar } from "../components/ChatSidebar";
import { type User } from "../types/chat.types";

export default function ChatMainPage() {
  const { userId } = useParams();
  const [showSidebar, setShowSidebar] = useState(false);

  const selectedUserId = userId;

  const navigate = useNavigate();
  const handleUserSelect = (user: User) => {
    navigate(`/dashboard/chat/messages/${user._id}`, {
      replace: true,
    });
    // Hide sidebar on mobile after selecting a user
    setShowSidebar(false);
  };

  const handleBackToChats = () => {
    setShowSidebar(true);
  };

  return (
    <DashboardLayout className="p-0">
      <div className="flex h-[calc(100vh-4rem)] bg-background">
        {/* Sidebar - Responsive visibility */}
        <div
          className={`${
            selectedUserId
              ? showSidebar
                ? "block"
                : "hidden lg:block"
              : "block"
          } w-full lg:w-80 border-r bg-card`}
        >
          <ChatSidebar
            selectedUserId={selectedUserId}
            onUserSelect={handleUserSelect}
          />
        </div>

        {/* Messages View - Pass back handler for mobile navigation */}
        <div
          className={`${
            selectedUserId
              ? showSidebar
                ? "hidden lg:block"
                : "block"
              : "hidden lg:block"
          } flex-1 flex flex-col`}
        >
          <Outlet context={{ onBackToChats: handleBackToChats }} />
        </div>
      </div>
    </DashboardLayout>
  );
}
