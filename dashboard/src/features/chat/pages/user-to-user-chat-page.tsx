import DashboardLayout from "@/components/layout/DashboardLayout";
import { getUserById } from "@/features/users/api/users.api";
import { type User as UsersUser } from "@/features/users/types/user.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UserToUserChatSidebar } from "../components/UserToUserChatSidebar";
import { UserToUserConversationView } from "../components/UserToUserConversationView";
import { type Chat, type User } from "../types/chat.types";
import { getOtherUser } from "../utils";

// Adapter function to convert users API User to chat User
const adaptUserForChat = (user: UsersUser): User => ({
  _id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  phoneNumber: user.phoneNumber
    ? {
        number: user.phoneNumber.number,
        isVerified: user.isVerified || false,
      }
    : undefined,
  profileImage: user.profileImage,
  coverImage: user.coverImage,
  isOnline: user.isOnline,
  hasVerificationBadge: user.isVerified,
  projectsView: 0, // Default value
  createdAt: user.createdAt || new Date().toISOString(),
  updatedAt: user.createdAt || new Date().toISOString(),
});

export default function UserToUserChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const userId = searchParams.get("user");
  // const chatId = searchParams.get("chat");

  // Load user from URL param if exists
  const { data: userData } = useQuery({
    queryKey: ["user-by-id", userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId && !selectedUser,
  });

  // Set user from URL param
  useEffect(() => {
    if (userData && !selectedUser) {
      setSelectedUser(adaptUserForChat(userData));
    }
  }, [userData, selectedUser]);

  // Clear user when URL param is removed
  useEffect(() => {
    if (!userId && selectedUser) {
      setSelectedUser(null);
      setSelectedChat(null);
      setOtherUser(null);
    }
  }, [userId, selectedUser]);

  // Handle selecting a user from search
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setSelectedChat(null);
    setOtherUser(null);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("user", user._id);
    newSearchParams.delete("chat");
    setSearchParams(newSearchParams);
    setShowSidebar(false);
  };

  // Handle clearing the selected user
  const handleClearUser = () => {
    setSelectedUser(null);
    setSelectedChat(null);
    setOtherUser(null);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("user");
    newSearchParams.delete("chat");
    setSearchParams(newSearchParams);
  };

  // Handle selecting a chat from the sidebar
  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    // Find the other user in the chat using the newestMessage
    if (chat.newestMessage) {
      const other = getOtherUser(selectedUser?._id, chat.newestMessage);
      setOtherUser(other);
      // Update search params to set user=otherUserId
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("user", other._id);
      newSearchParams.set("chat", chat._id);
      setSearchParams(newSearchParams);
    } else {
      setOtherUser(null);
    }
    setShowSidebar(false);
  };

  const handleBackToSelection = () => {
    setShowSidebar(true);
  };

  return (
    <DashboardLayout className="p-0">
      <div className="flex h-[calc(100vh-4rem)] bg-background">
        {/* Sidebar - Responsive visibility */}
        <div
          className={`${
            selectedUser ? (showSidebar ? "block" : "hidden lg:block") : "block"
          } w-full lg:w-80 border-r bg-card`}
        >
          <UserToUserChatSidebar
            selectedUser={selectedUser}
            onUserSelect={handleUserSelect}
            onClearUser={handleClearUser}
            selectedChat={selectedChat}
            onChatSelect={handleChatSelect}
          />
        </div>

        {/* Conversation View - Pass back handler for mobile navigation */}
        <div
          className={`${
            selectedUser && selectedChat && otherUser
              ? showSidebar
                ? "hidden lg:block"
                : "block"
              : "hidden lg:block"
          } flex-1 flex flex-col`}
        >
          {selectedUser && selectedChat && otherUser ? (
            <UserToUserConversationView
              user1={selectedUser}
              user2={otherUser}
              onBackToSelection={handleBackToSelection}
            />
          ) : selectedUser ? (
            <div className="flex-1 py-10 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <p className="text-lg font-medium">Select a Chat</p>
                <p className="text-sm">
                  Choose a chat from the sidebar to view the conversation
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 py-10 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <p className="text-lg font-medium">Select a User</p>
                <p className="text-sm">
                  Search for a user from the sidebar to view their chats
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
