import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { MediaPreview } from "@/components/ui/media-preview";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/features/auth/store";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, UsersIcon, X } from "lucide-react";
import { getUserChats } from "../api/chat.api";
import { type Chat, type User } from "../types/chat.types";
import { getOtherUser } from "../utils";
import { UserSearchSelect } from "./UserSearchSelect";

interface UserToUserChatSidebarProps {
  selectedUser: User | null;
  onUserSelect: (user: User) => void;
  onClearUser: () => void;
  selectedChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
}

export function UserToUserChatSidebar({
  selectedUser,
  onUserSelect,
  onClearUser,
  selectedChat,
  onChatSelect,
}: UserToUserChatSidebarProps) {

  const { data: chatsData, isLoading: isChatsLoading } = useQuery({
    queryKey: ["user-chats", selectedUser?._id],
    queryFn: () =>
      selectedUser
        ? getUserChats(selectedUser._id)
        : Promise.resolve({ data: [] }),
    enabled: !!selectedUser,
  });
  const chats: Chat[] = chatsData?.data || [];

  return (
    <div className="h-full flex flex-col bg-background">
      <CardHeader className="py-4">
        <CardTitle className="flex items-center gap-2">
          <UsersIcon className="w-5 h-5" />
          User Chats
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">User</label>
              {selectedUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearUser}
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
            {selectedUser ? (
              <div className="p-3 bg-muted/50 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <Image
                    src={selectedUser.profileImage}
                    alt={selectedUser.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{selectedUser.name}</p>
                    <p className="text-xs text-muted-foreground">
                      @{selectedUser.username}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <UserSearchSelect
                placeholder="Search for user..."
                selectedUserId={selectedUser?._id}
                onSelectUser={onUserSelect}
              />
            )}
          </div>
        </div>
        <Separator />
        {/* Chat List */}
        {selectedUser && (
          <div>
            <label className="block text-sm font-medium mb-2">Chats</label>
            {isChatsLoading ? (
              <div className="text-center text-muted-foreground py-4">
                Loading chats...
              </div>
            ) : chats.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                No chats found for this user.
              </div>
            ) : (
              <div className="space-y-2  max-h-[calc(100vh-20rem)] overflow-y-auto">
                {chats.map((chat) => {
                  const otherUser = chat?.newestMessage
                    ? getOtherUser(selectedUser._id, chat.newestMessage)
                    : null;
                  if (!otherUser) return null;

                  return (
                    <div
                      key={chat._id}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                        selectedChat?._id === chat._id ? "bg-accent" : ""
                      }`}
                      onClick={() => onChatSelect(chat)}
                    >
                      <div className="relative">
                        <MediaPreview
                          src={otherUser.profileImage}
                          alt={otherUser.name}
                          className="w-12 h-12 rounded-full"
                          fallback={
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <UsersIcon className="w-6 h-6 text-primary" />
                            </div>
                          }
                        />
                        {otherUser.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium truncate max-w-[150px]">
                              {otherUser.name}
                            </span>
                            {otherUser.hasVerificationBadge && (
                              <Badge variant="secondary" className="text-xs">
                                ✓
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {chat.newestMessage?.createdAt &&
                              new Date(
                                chat.newestMessage.createdAt
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="truncate">
                            {chat.newestMessage?.content
                              ? chat.newestMessage.content.length > 40
                                ? `${chat.newestMessage.content.substring(
                                    0,
                                    40
                                  )}...`
                                : chat.newestMessage.content
                              : "No messages"}
                          </span>
                          {chat.unreadMessageCount > 0 && (
                            <Badge
                              variant="destructive"
                              className="text-xs ml-2"
                            >
                              {chat.unreadMessageCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {!selectedUser && (
          <div className="text-center text-muted-foreground py-8">
            <UsersIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm mb-1">Select a user to view their chats</p>
            <p className="text-xs">Start by searching for a user above</p>
          </div>
        )}
      </CardContent>
    </div>
  );
}
