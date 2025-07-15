import DashboardLayout from "@/components/layout/DashboardLayout";
import { getUserById } from "@/features/users/api/users.api";
import { type User as UsersUser } from "@/features/users/types/user.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UserToUserChatSidebar } from "../components/UserToUserChatSidebar";
import { UserToUserConversationView } from "../components/UserToUserConversationView";
import { type User } from "../types/chat.types";

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
  const [selectedUser1, setSelectedUser1] = useState<User | null>(null);
  const [selectedUser2, setSelectedUser2] = useState<User | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const user1Id = searchParams.get("user1");
  const user2Id = searchParams.get("user2");

  // Load users from URL params if they exist
  const { data: user1Data } = useQuery({
    queryKey: ["user-by-id", user1Id],
    queryFn: () => getUserById(user1Id!),
    enabled: !!user1Id && !selectedUser1,
  });

  const { data: user2Data } = useQuery({
    queryKey: ["user-by-id", user2Id],
    queryFn: () => getUserById(user2Id!),
    enabled: !!user2Id && !selectedUser2,
  });

  // Set users from URL params
  useEffect(() => {
    if (user1Data && !selectedUser1) {
      setSelectedUser1(adaptUserForChat(user1Data));
    }
  }, [user1Data, selectedUser1]);

  useEffect(() => {
    if (user2Data && !selectedUser2) {
      setSelectedUser2(adaptUserForChat(user2Data));
    }
  }, [user2Data, selectedUser2]);

  // Clear users when URL params are removed
  useEffect(() => {
    if (!user1Id && selectedUser1) {
      setSelectedUser1(null);
    }
  }, [user1Id, selectedUser1]);

  useEffect(() => {
    if (!user2Id && selectedUser2) {
      setSelectedUser2(null);
    }
  }, [user2Id, selectedUser2]);

  const handleUser1Select = (user: User) => {
    setSelectedUser1(user);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("user1", user._id);
    setSearchParams(newSearchParams);
    setShowSidebar(false);
  };

  const handleUser2Select = (user: User) => {
    setSelectedUser2(user);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("user2", user._id);
    setSearchParams(newSearchParams);
    setShowSidebar(false);
  };

  const handleClearUser1 = () => {
    setSelectedUser1(null);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("user1");
    setSearchParams(newSearchParams);
  };

  const handleClearUser2 = () => {
    setSelectedUser2(null);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("user2");
    setSearchParams(newSearchParams);
  };

  const handleClearSelection = () => {
    setSelectedUser1(null);
    setSelectedUser2(null);
    setSearchParams({});
    setShowSidebar(true);
  };

  const handleBackToSelection = () => {
    setShowSidebar(true);
  };

  const isUsersSelected = selectedUser1 && selectedUser2;

  return (
    <DashboardLayout className="p-0">
      <div className="flex h-[calc(100vh-4rem)] bg-background">
        {/* Sidebar - Responsive visibility */}
        <div
          className={`${
            isUsersSelected
              ? showSidebar
                ? "block"
                : "hidden lg:block"
              : "block"
          } w-full lg:w-80 border-r bg-card`}
        >
          <UserToUserChatSidebar
            selectedUser1={selectedUser1}
            selectedUser2={selectedUser2}
            onUser1Select={handleUser1Select}
            onUser2Select={handleUser2Select}
            onClearUser1={handleClearUser1}
            onClearUser2={handleClearUser2}
            onClearSelection={handleClearSelection}
          />
        </div>

        {/* Conversation View - Pass back handler for mobile navigation */}
        <div
          className={`${
            isUsersSelected
              ? showSidebar
                ? "hidden lg:block"
                : "block"
              : "hidden lg:block"
          } flex-1 flex flex-col`}
        >
          {isUsersSelected ? (
            <UserToUserConversationView
              user1={selectedUser1}
              user2={selectedUser2}
              onBackToSelection={handleBackToSelection}
            />
          ) : (
            <div className="flex-1 py-10 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <p className="text-lg font-medium">Select Two Users</p>
                <p className="text-sm">
                  Choose two users from the sidebar to view their conversation
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
