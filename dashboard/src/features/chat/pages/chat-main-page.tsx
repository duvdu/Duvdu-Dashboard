import DashboardLayout from "@/components/layout/DashboardLayout";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { ChatSidebar } from "../components/ChatSidebar";
import { type User } from "../types/chat.types";

export default function ChatMainPage() {
  const { userId } = useParams();

  const selectedUserId = userId;

  const navigate = useNavigate();
  const handleUserSelect = (user: User) => {
    navigate(`/dashboard/chat/${user._id}`);
  };

  return (
    <DashboardLayout className="p-0">
      <div className="flex h-[calc(100vh-4rem)] bg-background">
        {/* Sidebar - Hidden on mobile when user is selected */}
        <div
          className={`${
            selectedUserId ? "hidden lg:block" : "block"
          } w-full lg:w-80 border-r bg-card`}
        >
          <ChatSidebar
            selectedUserId={selectedUserId}
            onUserSelect={handleUserSelect}
          />
        </div>

        {/* Messages View - Hidden on mobile when no user is selected */}
        <div
          className={`${
            selectedUserId ? "block" : "hidden lg:block"
          } flex-1 flex flex-col`}
        >
          <Outlet />
        </div>
      </div>
    </DashboardLayout>
  );
}
