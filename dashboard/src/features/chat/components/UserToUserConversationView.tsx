import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  MessageSquareIcon,
  RefreshCw,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { getChatBetweenUsers } from "../api/chat.api";
import { type MessageFilters, type User } from "../types/chat.types";
import { MessageList } from "./MessageList";

interface UserToUserConversationViewProps {
  user1: User;
  user2: User;
  onBackToSelection: () => void;
  filters?: MessageFilters;
}

export function UserToUserConversationView({
  user1,
  user2,
  onBackToSelection,
  filters = { page: 1, limit: 50 },
}: UserToUserConversationViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["user-to-user-chat", user1._id, user2._id, filters],
    queryFn: () => getChatBetweenUsers(user1._id, user2._id, filters),
    retry: false,
  });

  const messages = data?.data || [];

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [data?.data]);

  const isNotFoundError =
    error?.response?.data?.errors?.[0]?.message === "Not found error";

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <CardHeader className="py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToSelection}
              className="lg:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <img
                  src={user1.profileImage || "/default-avatar.png"}
                  alt={user1.name}
                  className="w-8 h-8 rounded-full border-2 border-background"
                />
                <img
                  src={user2.profileImage || "/default-avatar.png"}
                  alt={user2.name}
                  className="w-8 h-8 rounded-full border-2 border-background"
                />
              </div>

              <div>
                <CardTitle className="text-lg">
                  {user1.name} & {user2.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  @{user1.username} • @{user2.username}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {data && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <MessageSquareIcon className="w-3 h-3" />
                {data.pagination.resultCount} messages
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader className="w-4 h-4" />
            Loading conversation...
          </div>
        )}
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader className="w-8 h-8 mb-4" />
                <p className="text-sm text-muted-foreground">
                  Loading conversation between {user1.name} and {user2.name}...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12">
                {isNotFoundError ? (
                  <div className="text-center text-muted-foreground">
                    <MessageSquareIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-medium mb-2">No conversation found</h3>
                    <p className="text-sm mb-4">
                      {user1.name} and {user2.name} haven't started a
                      conversation yet.
                    </p>
                    <Button
                      variant="outline"
                      onClick={onBackToSelection}
                      size="sm"
                    >
                      Select Different Users
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive opacity-50" />
                    <h3 className="font-medium mb-2 text-destructive">
                      Failed to load conversation
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      There was an error loading the messages. Please try again.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => refetch()}
                        size="sm"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                      </Button>
                      <Button
                        variant="outline"
                        onClick={onBackToSelection}
                        size="sm"
                      >
                        Back to Selection
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquareIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-medium mb-2">No messages yet</h3>
                <p className="text-sm">
                  {user1.name} and {user2.name} haven't exchanged any messages.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-4 p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    Conversation between{" "}
                    <span className="font-medium">{user1.name}</span> and{" "}
                    <span className="font-medium">{user2.name}</span>
                  </p>
                </div>
                <MessageList
                  messages={messages}
                  currentUserId={user1._id}
                  onDeleteMessage={() => {}}
                  onUpdateMessage={() => {}}
                  onReplyToMessage={() => {}}
                />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
    </div>
  );
}
