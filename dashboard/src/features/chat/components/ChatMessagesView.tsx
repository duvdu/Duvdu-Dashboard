import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { MediaPreview } from "@/components/ui/media-preview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PERMISSION_KEYS } from "@/config/permissions";
import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/features/auth/store";
import { useInfiniteQuery } from "@/hooks/useInfiniteQuery";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, MessageCircleIcon, User, UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { toast } from "sonner";
import { deleteMessage, getChatMessages, updateMessage } from "../api/chat.api";
import { type Message } from "../types/chat.types";
import { MessageList } from "./MessageList";
import { SendMessageForm } from "./SendMessageForm";

import { useChatStore } from "../store";
import { getOtherUser } from "../utils";

interface ChatOutletContext {
  onBackToChats: () => void;
}

export function ChatMessagesView() {
  const { userId } = useParams();
  const { user } = useAuthStore();
  const { onBackToChats } = useOutletContext<ChatOutletContext>();
  const { socket } = useSocket();
  const currentUserId = user?._id;
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);

  const {
    data: messagesArr,
    isLoading,
    isLoadingMore,
    error,
    latestData,
    hasMore,
    observerRef,
    reset,
    setItems,
  } = useInfiniteQuery<Message>({
    queryFn: ({ page, limit }) => getChatMessages(userId!, { page, limit }),
    queryParams: {
      userId,
    },
    pageSize: 20,
    resetTriggers: [userId],
    enabled: !!userId,
    reversed: true,
  });

  const {
    messages,
    setMessages,
    addMessage,
    updateMessage: updateStoreMessage,
    removeMessage,
  } = useChatStore();

  useEffect(() => {
    if (messagesArr) {
      setMessages(messagesArr);
    }
  }, [messagesArr, userId, setMessages]);

  const currentReceiver = latestData?.user;

  // Delete message
  const deleteMessageMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: (_, messageId) => {
      toast.success("Message deleted");
      removeMessage(messageId);
    },
    onError: () => {
      toast.error("Failed to delete message");
    },
  });

  // Update message
  const updateMessageMutation = useMutation({
    mutationFn: ({
      messageId,
      content,
    }: {
      messageId: string;
      content: string;
    }) => updateMessage(messageId, { content }),
    onSuccess: (data) => {
      toast.success("Message updated");
      console.log(data, "data");
      updateStoreMessage(data?._id, data);
    },
    onError: () => {
      toast.error("Failed to update message");
    },
  });

  // Scroll to bottom on initial load only
  useEffect(() => {
    if (
      !isLoading &&
      messages.length > 0 &&
      messagesEndRef.current &&
      isInitialLoad.current
    ) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
      isInitialLoad.current = false;
    }
  }, [isLoading, messages.length]);

  useEffect(() => {
    if (!socket || !userId || !currentUserId) return;
    const handleNewMessage = (res: { message: Message }) => {
      const message = res.message;
      const otherUser = getOtherUser(currentUserId, message);
      if (otherUser?._id === userId) {
        addMessage(message);
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    socket.on("new_message", handleNewMessage);
    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, userId, currentUserId, latestData?.user]);

  const handleDeleteMessage = (messageId: string) => {
    deleteMessageMutation.mutate(messageId);
  };

  const handleUpdateMessage = (messageId: string, content: string) => {
    updateMessageMutation.mutate({ messageId, content });
  };

  const handleReplyToMessage = (message: Message) => {
    setReplyingTo(message);
  };

  const handleMessageSent = () => {
    setReplyingTo(null);
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!userId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/10">
        <div className="text-center">
          <MessageCircleIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Welcome to Messages</h3>
          <p className="text-muted-foreground">
            Select a conversation from the sidebar to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <CardHeader className="border-b flex items-center justify-between py-2">
        <div className="flex items-center space-x-3">
          {/* Back Button - Only visible on mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToChats}
            className="lg:hidden p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="relative">
            <MediaPreview
              src={currentReceiver?.profileImage}
              alt={currentReceiver?.name || "User"}
              className="w-10 h-10 rounded-full"
              fallback={
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-primary" />
                </div>
              }
            />
            {currentReceiver?.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">
                {isLoading
                  ? "Loading..."
                  : currentReceiver?.name || "Unknown User"}
              </span>
              {currentReceiver?.hasVerificationBadge && (
                <Badge variant="secondary" className="text-xs">
                  ✓
                </Badge>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {isLoading
                ? "Loading user info..."
                : currentReceiver?.isOnline
                ? "Online"
                : "Offline"}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <ProtectedComponent permissionKeys={[PERMISSION_KEYS.USERS.VIEW]}>
            <Link to={`/dashboard/users/${userId}`}>
              <Button variant="ghost" size="lg" disabled={isLoading}>
                <User className="w-4 h-4" />
                Go to Profile
              </Button>
            </Link>
          </ProtectedComponent>
        </div>
      </CardHeader>
      {/* Messages Area */}
      <CardContent className="flex-1 p-0 flex flex-col  overflow-y-auto">
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader className="size-10" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>Failed to load messages</p>
                <Button variant="outline" onClick={reset} className="mt-2">
                  Retry
                </Button>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircleIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            ) : (
              <MessageList
                messages={messages}
                currentUserId={currentUserId!}
                onDeleteMessage={handleDeleteMessage}
                onUpdateMessage={handleUpdateMessage}
                onReplyToMessage={handleReplyToMessage}
                observerRef={observerRef}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
              />
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <Separator />
        {/* Reply Banner */}
        {replyingTo && (
          <div className="px-4 py-2 bg-muted/50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-8 bg-primary rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">
                    Replying to {replyingTo.sender?.name || "Unknown User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate max-w-xs">
                    {replyingTo.content}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(null)}
              >
                ×
              </Button>
            </div>
          </div>
        )}
        {/* Message Input */}
        <div className="p-4">
          <SendMessageForm
            receiverId={userId}
            onMessageSent={handleMessageSent}
            replyTo={replyingTo?._id}
            previousMessages={messages}
            setMessages={setItems}
          />
        </div>
      </CardContent>
    </div>
  );
}
