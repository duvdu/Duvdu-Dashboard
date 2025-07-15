import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";
import { useAuthStore } from "@/features/auth/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  archiveChat,
  deleteChat,
  deleteMessage,
  exportChatConversation,
  getChatMessages,
  markMessagesAsWatched,
  muteChat,
  pinChat,
  updateMessage,
} from "../api/chat.api";
import { ChatHeader } from "../components/ChatHeader";
import { MessageList } from "../components/MessageList";
import { SendMessageForm } from "../components/SendMessageForm";
import { type Message } from "../types/chat.types";

export default function ChatDetailsPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();

  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  // Fetch messages
  const {
    data: messagesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["messages", userId],
    queryFn: () => getChatMessages(userId!, { limit: 50 }),
    enabled: !!userId,
  });

  const messages = messagesData?.data || [];

  // Get chat info from messages
  const chat =
    messages.length > 0
      ? {
          _id: `chat-${userId}`,
          participants: [messages[0]?.sender, messages[0]?.receiver].filter(
            Boolean
          ),
          lastMessage: messages[0],
          unreadCount: messages.filter(
            (msg) => !msg.isRead && msg.sender._id !== currentUser?._id
          ).length,
          isArchived: false,
          isPinned: false,
          mutedUntil: undefined,
          createdAt:
            messages[messages.length - 1]?.createdAt ||
            new Date().toISOString(),
          updatedAt: messages[0]?.updatedAt || new Date().toISOString(),
        }
      : null;

  const otherParticipant =
    messages.find((msg) => msg.sender._id !== currentUser?._id)?.sender ||
    messages.find((msg) => msg.receiver._id !== currentUser?._id)?.receiver;

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      toast.success("Message deleted successfully");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete message");
    },
  });

  // Update message mutation
  const updateMessageMutation = useMutation({
    mutationFn: ({
      messageId,
      content,
    }: {
      messageId: string;
      content: string;
    }) => updateMessage(messageId, { content }),
    onSuccess: () => {
      toast.success("Message updated successfully");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update message");
    },
  });

  // Mark messages as watched
  const markAsWatchedMutation = useMutation({
    mutationFn: markMessagesAsWatched,
    onSuccess: () => {
      refetch();
    },
  });

  // Archive chat mutation
  const archiveChatMutation = useMutation({
    mutationFn: (archive: boolean) => archiveChat(`chat-${userId}`, archive),
    onSuccess: () => {
      toast.success("Chat archived successfully");
      navigate("/dashboard/chat");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to archive chat");
    },
  });

  // Pin chat mutation
  const pinChatMutation = useMutation({
    mutationFn: (pin: boolean) => pinChat(`chat-${userId}`, pin),
    onSuccess: () => {
      toast.success("Chat pinned successfully");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to pin chat");
    },
  });

  // Mute chat mutation
  const muteChatMutation = useMutation({
    mutationFn: (duration?: number) => muteChat(`chat-${userId}`, duration),
    onSuccess: () => {
      toast.success("Chat muted successfully");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to mute chat");
    },
  });

  // Delete chat mutation
  const deleteChatMutation = useMutation({
    mutationFn: () => deleteChat(userId!),
    onSuccess: () => {
      toast.success("Chat deleted successfully");
      navigate("/dashboard/chat");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete chat");
    },
  });

  // Export chat mutation
  const exportChatMutation = useMutation({
    mutationFn: () => exportChatConversation(userId!),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `chat-${otherParticipant?.username || userId}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Chat exported successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to export chat");
    },
  });

  // Mark unread messages as watched on mount
  useEffect(() => {
    if (messages.length > 0 && userId) {
      const unreadMessages = messages
        .filter((msg) => !msg.isRead && msg.sender._id !== currentUser?._id)
        .map((msg) => msg._id);

      if (unreadMessages.length > 0) {
        markAsWatchedMutation.mutate(userId, { messages: unreadMessages });
      }
    }
  }, [messages, userId, currentUser?._id]);

  const handleDeleteMessage = (messageId: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      deleteMessageMutation.mutate(messageId);
    }
  };

  const handleUpdateMessage = (messageId: string, content: string) => {
    updateMessageMutation.mutate({ messageId, content });
  };

  const handleReplyToMessage = (message: Message) => {
    setReplyingTo(message);
  };

  const handleMessageSent = () => {
    setReplyingTo(null);
    refetch();
  };

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircleIcon className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-destructive">
            Invalid Chat
          </h3>
          <p className="text-muted-foreground mt-2">
            The chat you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Button onClick={() => navigate("/dashboard/chat")} className="mt-4">
            Go Back to Chats
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircleIcon className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-destructive">
            Error loading chat
          </h3>
          <p className="text-muted-foreground mt-2">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
          <div className="flex gap-2 mt-4 justify-center">
            <Button onClick={() => refetch()}>Try again</Button>
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard/chat")}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!otherParticipant) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircleIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No conversation found</h3>
          <p className="text-muted-foreground mt-2">
            Start a conversation with this user to see messages here.
          </p>
          <Button onClick={() => navigate("/dashboard/chat")} className="mt-4">
            Go Back to Chats
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Chat Header */}
      {chat && (
        <ChatHeader
          chat={chat}
          otherParticipant={otherParticipant}
          onArchive={() => archiveChatMutation.mutate(!chat.isArchived)}
          onPin={() => pinChatMutation.mutate(!chat.isPinned)}
          onMute={() => muteChatMutation.mutate(60)} // Mute for 1 hour
          onDelete={() => {
            if (
              window.confirm(
                "Are you sure you want to delete this entire chat? This action cannot be undone."
              )
            ) {
              deleteChatMutation.mutate();
            }
          }}
          onExport={() => exportChatMutation.mutate()}
        />
      )}

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          currentUserId={currentUser?._id || ""}
          onDeleteMessage={handleDeleteMessage}
          onUpdateMessage={handleUpdateMessage}
          onReplyToMessage={handleReplyToMessage}
          className="h-full"
        />
      </div>

      {/* Reply indicator */}
      {replyingTo && (
        <div className="px-4 py-2 bg-muted border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Replying to:</span>
              <span className="text-sm text-muted-foreground truncate">
                {replyingTo.content}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(null)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t">
        <SendMessageForm
          receiverId={userId}
          onMessageSent={handleMessageSent}
          placeholder={`Message ${otherParticipant.name}...`}
        />
      </div>
    </div>
  );
}
