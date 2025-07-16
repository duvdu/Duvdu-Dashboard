import axios from "@/lib/axios";
import type {
  Chat,
  ChatFilters,
  ChatResponse,
  ChatStats,
  MarkMessagesAsWatchedPayload,
  Message,
  MessageFilters,
  MessagesResponse,
  SendMessagePayload,
  UpdateMessagePayload,
  User,
} from "../types/chat.types";

// Get all chats
export const getChats = async (
  filters: ChatFilters = {}
): Promise<ChatResponse> => {
  const { data } = await axios.get("/api/message", {
    params: Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== undefined && value !== ""
      )
    ),
  });
  return data;
};

// Get chats for a specific user
export const getUserChats = async (
  userId: string,
  filters: ChatFilters = {}
): Promise<ChatResponse> => {
  const { data } = await axios.get(`/api/message/${userId}/chats`, {
    params: Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== undefined && value !== ""
      )
    ),
  });
  return data;
};

// Get messages in a specific chat
export const getChatMessages = async (
  userId: string,
  filters: MessageFilters = {}
): Promise<MessagesResponse> => {
  const { data } = await axios.get(`/api/message/${userId}/chat`, {
    params: Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== undefined && value !== ""
      )
    ),
  });
  return data;
};

// Get chat between two specific users
export const getChatBetweenUsers = async (
  userId1: string,
  userId2: string,
  filters: MessageFilters = {}
): Promise<MessagesResponse> => {
  const { data } = await axios.get(`/api/message/${userId1}/chat/${userId2}`, {
    params: Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== undefined && value !== ""
      )
    ),
  });
  return data;
};

// Send a message
export const sendMessage = async (
  payload: SendMessagePayload
): Promise<Message> => {
  const formData = new FormData();
  formData.append("content", payload.content);
  formData.append("receiver", payload.receiver);

  if (payload.replyTo) {
    formData.append("replyTo", payload.replyTo);
  }

  if (payload.messageType) {
    formData.append("messageType", payload.messageType);
  }

  if (payload.attachments) {
    if (payload.attachments instanceof FileList) {
      Array.from(payload.attachments).forEach((file) => {
        formData.append("attachments", file);
      });
    } else if (Array.isArray(payload.attachments)) {
      payload.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }
  }

  const { data } = await axios.post("/api/message", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data;
};

// Update a message
export const updateMessage = async (
  messageId: string,
  payload: UpdateMessagePayload
): Promise<Message> => {
  const formData = new FormData();

  if (payload.content) {
    formData.append("content", payload.content);
  }

  if (payload.attachments) {
    if (payload.attachments instanceof FileList) {
      Array.from(payload.attachments).forEach((file) => {
        formData.append("attachments", file);
      });
    } else if (Array.isArray(payload.attachments)) {
      payload.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }
  }

  if (payload.reactions) {
    payload.reactions.forEach((reaction, index) => {
      formData.append(`reactions[${index}][type]`, reaction.type);
    });
  }

  const { data } = await axios.patch(`/api/message/${messageId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data;
};

// Delete a message
export const deleteMessage = async (messageId: string): Promise<void> => {
  await axios.delete(`/api/message/${messageId}`);
};

// Mark messages as watched
export const markMessagesAsWatched = async (
  receiverId: string,
  payload: MarkMessagesAsWatchedPayload
): Promise<void> => {
  await axios.patch(`/api/message/${receiverId}/chat`, payload);
};

// Delete entire chat
export const deleteChat = async (userId: string): Promise<void> => {
  await axios.delete(`/api/message/${userId}/chat`);
};

// Search users for messaging
export const searchUsers = async (
  query: string,
  searchBy?: string,
  limit?: number
): Promise<User[]> => {
  const params: Record<string, any> = {};

  if (searchBy === "name") {
    params.search = query;
  } else if (searchBy === "username") {
    params.username = query;
  } else if (searchBy === "phone") {
    params.phoneNumber = query;
  } else if (searchBy === "email") {
    params.email = query;
  } else {
    params.search = query;
  }

  if (limit) {
    params.limit = limit;
  }

  const { data } = await axios.get("/api/users/auth/find", { params });
  return data.data;
};

// Get chat statistics (for admin dashboard)
export const getChatStats = async (): Promise<ChatStats> => {
  const { data } = await axios.get("/api/message/stats");
  return data.data;
};

// Get message by ID
export const getMessageById = async (messageId: string): Promise<Message> => {
  const { data } = await axios.get(`/api/message/${messageId}`);
  return data.data;
};

// Get chat by ID
export const getChatById = async (chatId: string): Promise<Chat> => {
  const { data } = await axios.get(`/api/message/chat/${chatId}`);
  return data.data;
};

// Export a chat conversation (CSV or JSON)
export const exportChatConversation = async (
  userId: string,
  format: "csv" | "json" = "csv"
): Promise<Blob> => {
  const { data } = await axios.get(`/api/message/${userId}/chat/export`, {
    params: { format },
    responseType: "blob",
  });
  return data;
};

// Get user's active chats count
export const getActiveChatsCount = async (): Promise<number> => {
  const { data } = await axios.get("/api/message/count/active");
  return data.count;
};

// Get unread messages count
export const getUnreadMessagesCount = async (): Promise<number> => {
  const { data } = await axios.get("/api/message/count/unread");
  return data.count;
};

// Archive/unarchive chat
export const archiveChat = async (
  chatId: string,
  archive: boolean = true
): Promise<void> => {
  await axios.patch(`/api/message/chat/${chatId}/archive`, { archive });
};

// Pin/unpin chat
export const pinChat = async (
  chatId: string,
  pin: boolean = true
): Promise<void> => {
  await axios.patch(`/api/message/chat/${chatId}/pin`, { pin });
};

// Mute/unmute chat
export const muteChat = async (
  chatId: string,
  duration?: number
): Promise<void> => {
  await axios.patch(`/api/message/chat/${chatId}/mute`, { duration });
};

// Get notification history
export const getNotificationHistory = async (
  filters: any = {}
): Promise<any> => {
  const { data } = await axios.get("/api/notification/crm", {
    params: Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== undefined && value !== ""
      )
    ),
  });
  return data;
};
