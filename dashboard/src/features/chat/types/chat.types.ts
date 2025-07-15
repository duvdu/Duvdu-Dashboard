export type User = {
  _id: string;
  name: string;
  username: string;
  email?: string;
  phoneNumber?: {
    number: string;
    isVerified: boolean;
  };
  profileImage?: string;
  coverImage?: string;
  isOnline: boolean;
  lastSeen?: string;
  about?: string;
  hasVerificationBadge: boolean;
  projectsView?: number;
  rank?: {
    nextRangPercentage: number;
    title: string;
    nextRankPercentage: number;
    nextRankTitle: string;
    color: string;
  };
  canChat?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MessageAttachment = {
  _id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  uploadedAt: string;
};

export type MessageMedia = {
  _id: string;
  type: string;
  url: string;
};

export type MessageWatcher = {
  _id: string;
  user: string;
  watched: boolean;
};

export type MessageReaction = {
  _id: string;
  type: string;
  user: User;
  createdAt: string;
};

export type Message = {
  _id: string;
  sender: User;
  receiver: User;
  content: string;
  attachments?: MessageAttachment[];
  media?: MessageMedia[];
  watchers?: MessageWatcher[];
  reactions?: MessageReaction[];
  updated: boolean;
  editedAt?: string;
  replyTo?: string;
  messageType: "text" | "image" | "video" | "audio" | "file";
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

export type Chat = {
  _id: string;
  sender: string;
  receiver: string;
  newestMessage?: Message;
  unreadMessageCount: number;
  canChat: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Additional metadata for frontend use
  isArchived?: boolean;
  isPinned?: boolean;
  mutedUntil?: string;
  // For backward compatibility
  participants?: User[];
  lastMessage?: Message;
  unreadCount?: number;
};

export type ChatResponse = {
  message: string;
  pagination: {
    currentPage: number;
    resultCount: number;
    totalPages: number;
  };
  data: Chat[];
};

export type MessagesResponse = {
  message: string;
  pagination: {
    currentPage: number;
    resultCount: number;
    totalPages: number;
  };
  data: Message[];
  user?: User;
};

export type ChatFilters = {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isArchived?: boolean;
  isPinned?: boolean;
};

export type MessageFilters = {
  page?: number;
  limit?: number;
  messageType?: "text" | "image" | "video" | "audio" | "file";
  dateFrom?: string;
  dateTo?: string;
};

export type SendMessagePayload = {
  content: string;
  receiver: string;
  attachments?: FileList | File[];
  replyTo?: string;
  messageType?: "text" | "image" | "video" | "audio" | "file";
};

export type UpdateMessagePayload = {
  content?: string;
  attachments?: FileList | File[];
  reactions?: Array<{
    type: string;
  }>;
};

export type MarkMessagesAsWatchedPayload = {
  messages: string[];
};

export type ChatSearchResult = {
  _id: string;
  participants: User[];
  lastMessage?: Message;
  matchedMessages?: Message[];
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
};

export type MessageSearchResult = {
  _id: string;
  sender: User;
  receiver: User;
  content: string;
  chat: Chat;
  createdAt: string;
  highlightedContent?: string;
};

export type ChatStats = {
  totalChats: number;
  totalMessages: number;
  activeChats: number;
  avgResponseTime: number;
  mostActiveUsers: Array<{
    user: User;
    messageCount: number;
  }>;
};
