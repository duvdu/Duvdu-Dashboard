import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { MediaPreview } from "@/components/ui/media-preview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuthStore } from "@/features/auth/store";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { MessageCircleIcon, SearchIcon, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getChats, searchUsers } from "../api/chat.api";
import { type User } from "../types/chat.types";
import { getOtherUser } from "../utils";

interface ChatSidebarProps {
  selectedUserId?: string | null;
  onUserSelect: (user: User) => void;
}

export function ChatSidebar({
  selectedUserId,
  onUserSelect,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"chats" | "users">("chats");
  const { isMobile } = useSidebar();
  const { user } = useAuthStore();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch existing chats
  const { data: chatsData, isLoading: isLoadingChats } = useQuery({
    queryKey: ["chats", debouncedQuery],
    queryFn: () =>
      getChats({
        search: debouncedQuery,
      }),
    enabled: activeTab === "chats",
  });

  // Search users
  const { data: searchedUsers = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users", "search", debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery, undefined, 20),
    enabled: activeTab === "users",
  });

  const chats = chatsData?.data || [];

  const truncateMessage = (content: string, maxLength: number = 40) => {
    return content.length > maxLength
      ? `${content.substring(0, maxLength)}...`
      : content;
  };

  useEffect(() => {
    if (!selectedUserId && chats.length > 0 && !isMobile) {
      onUserSelect(getOtherUser(user?._id, chats[0].newestMessage));
    }
  }, [selectedUserId, chatsData?.data, onUserSelect]);

  const handleStartNewChat = () => {
    setActiveTab("users");
    setSearchQuery("");
    setDebouncedQuery("");
  };

  return (
    <div className="h-full flex flex-col min-w-0">
      {/* Header */}
      <CardHeader className="py-2 gap-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Messages</CardTitle>
        </div>

        {/* Search Input */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={
              activeTab === "chats"
                ? "Search conversations..."
                : "Search users to start new chat..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-2">
          <Button
            variant={activeTab === "chats" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setActiveTab("chats");
              setSearchQuery("");
              setDebouncedQuery("");
            }}
            className="flex-1"
          >
            <MessageCircleIcon className="w-4 h-4 mr-2" />
            Chats
          </Button>
          <Button
            variant={activeTab === "users" ? "default" : "outline"}
            size="sm"
            onClick={handleStartNewChat}
            className="flex-1"
          >
            <UserIcon className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>
      </CardHeader>

      <Separator />

      {/* Content */}
      <CardContent className="flex-1 p-0 overflow-y-auto">
        <ScrollArea className="h-full overflow-y-auto">
          {activeTab === "chats" ? (
            <div className="space-y-1 p-3">
              {isLoadingChats ? (
                <div className="flex justify-center py-8">
                  <Loader className="size-10" />
                </div>
              ) : chats.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircleIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No conversations yet</p>
                  <p className="text-sm mb-4">
                    Start chatting with users to see your conversations here
                  </p>
                  {/* <ProtectedComponent
                    permissionKey={PERMISSION_KEYS.MESSAGES.SEND}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleStartNewChat}
                      className="flex items-center justify-center w-full gap-2"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Start New Chat
                    </Button>
                  </ProtectedComponent> */}
                </div>
              ) : (
                chats.map((chat) => {
                  const otherUser = getOtherUser(user?._id, chat.newestMessage);
                  if (!otherUser) return null;

                  return (
                    <div
                      key={chat._id}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg  cursor-pointer transition-colors hover:bg-accent",
                        selectedUserId === otherUser._id && "bg-accent"
                      )}
                      onClick={() => onUserSelect(otherUser)}
                    >
                      <div className="relative">
                        <MediaPreview
                          src={otherUser.profileImage}
                          alt={otherUser.name}
                          className="w-12 h-12 rounded-full"
                          fallback={
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <UserIcon className="w-6 h-6 text-primary" />
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
                          <span className="truncate flex-1 min-w-0 ">
                            {chat.newestMessage?.content
                              ? truncateMessage(chat.newestMessage.content, 35)
                              : "No messages"}
                          </span>
                          {chat.unreadMessageCount > 0 && (
                            <Badge
                              variant="destructive"
                              className="text-xs flex-shrink-0"
                            >
                              {chat.unreadMessageCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="space-y-1 p-3">
              {isLoadingUsers ? (
                <div className="flex justify-center py-8">
                  <Loader className="size-10" />
                </div>
              ) : searchedUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <UserIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">
                    {debouncedQuery
                      ? "No users found"
                      : "Search users to start a conversation"}
                  </p>
                  <p className="text-sm">
                    {debouncedQuery
                      ? "Try searching with different keywords"
                      : "Type a name to find users"}
                  </p>
                </div>
              ) : (
                <>
                  {searchedUsers.map((user) => (
                    <div
                      key={user._id}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent",
                        selectedUserId === user._id && "bg-accent"
                      )}
                      onClick={() => onUserSelect(user)}
                    >
                      <div className="relative">
                        <MediaPreview
                          src={user.profileImage}
                          alt={user.name}
                          className="w-12 h-12 rounded-full"
                          fallback={
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <UserIcon className="w-6 h-6 text-primary" />
                            </div>
                          }
                        />
                        {user.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium max-w-[150px] truncate">
                              {user.name}
                            </span>
                            {user.hasVerificationBadge && (
                              <Badge variant="secondary" className="text-xs">
                                ✓
                              </Badge>
                            )}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs px-2 py-1 h-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUserSelect(user);
                            }}
                          >
                            Chat
                          </Button>
                        </div>
                        <span className="text-xs text-muted-foreground max-w-[150px] truncate">
                          @{user.username}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </div>
  );
}
