import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { MediaPreview } from "@/components/ui/media-preview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { MessageCircleIcon, SearchIcon, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getChats, searchUsers } from "../api/chat.api";
import { type Chat, type User } from "../types/chat.types";

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

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch existing chats
  const { data: chatsData, isLoading: isLoadingChats } = useQuery({
    queryKey: ["chats"],
    queryFn: () => getChats(),
    enabled: activeTab === "chats",
  });

  // Search users
  const { data: searchedUsers = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users", "search", debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery, undefined, 20),
    // enabled: activeTab === "users" && debouncedQuery.trim().length > 0,
  });

  const chats = chatsData?.data || [];

  const getOtherUser = (chat: Chat) => {
    return chat.newestMessage?.receiver;
  };

  const truncateMessage = (content: string, maxLength: number = 40) => {
    return content.length > maxLength
      ? `${content.substring(0, maxLength)}...`
      : content;
  };

  useEffect(() => {
    if (!selectedUserId && chats.length > 0) {
      onUserSelect(chats[0].newestMessage?.receiver as User);
    }
  }, [selectedUserId, chatsData?.data, onUserSelect]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Messages</CardTitle>

        {/* Search Input */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search conversations or users..."
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
            onClick={() => setActiveTab("chats")}
            className="flex-1"
          >
            <MessageCircleIcon className="w-4 h-4 mr-2" />
            Chats
          </Button>
          <Button
            variant={activeTab === "users" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("users")}
            className="flex-1"
          >
            <UserIcon className="w-4 h-4 mr-2" />
            Users
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
                  <MessageCircleIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No conversations yet</p>
                  <p className="text-sm">Start a new conversation</p>
                </div>
              ) : (
                chats.map((chat) => {
                  const otherUser = getOtherUser(chat);
                  if (!otherUser) return null;

                  return (
                    <div
                      key={chat._id}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent",
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
                            <span className="font-medium truncate">
                              {otherUser.name}
                            </span>
                            {otherUser.hasVerificationBadge && (
                              <Badge variant="secondary" className="text-xs">
                                ✓
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {/* {formatLastMessageTime(chat.updatedAt)} */}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-muted-foreground truncate">
                            {chat.newestMessage
                              ? truncateMessage(chat.newestMessage.content)
                              : "No messages yet"}
                          </span>
                          {chat.unreadMessageCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
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
                  <UserIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>
                    {debouncedQuery.trim()
                      ? "No users found"
                      : "Search for users"}
                  </p>
                  <p className="text-sm">
                    {debouncedQuery.trim()
                      ? "Try a different search term"
                      : "Enter a name, username, or email"}
                  </p>
                </div>
              ) : (
                searchedUsers.map((user) => (
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
                      <div className="flex items-center space-x-2">
                        <span className="font-medium max-w-[180px] truncate">
                          {user.name}
                        </span>
                        {user.hasVerificationBadge && (
                          <Badge variant="secondary" className="text-xs">
                            ✓
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground truncate">
                        @{user.username}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </div>
  );
}
