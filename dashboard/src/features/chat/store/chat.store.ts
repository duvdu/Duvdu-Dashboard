import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Message } from "../types/chat.types";

interface ChatState {
  messages: Message[];

  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updatedMessage: Message) => void;
  removeMessage: (messageId: string) => void;

  // Utility actions
  getChatId: (user1Id: string, user2Id: string) => string;
  clearChat: () => void;
  clearAllChats: () => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set) => ({
      // Initial state
      messages: [],

      // Message actions
      setMessages: (messages) =>
        set(() => ({
          messages: messages,
        })),

      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      updateMessage: (messageId, updatedMessage) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg._id === messageId ? updatedMessage : msg
          ),
        })),

      removeMessage: (messageId) =>
        set((state) => ({
          messages: state.messages.filter((msg) => msg._id !== messageId),
        })),

      clearChat: () =>
        set(() => {
          return {
            messages: [],
          };
        }),

      clearAllChats: () =>
        set({
          messages: [],
        }),
    }),
    {
      name: "chat-store",
    }
  )
);
