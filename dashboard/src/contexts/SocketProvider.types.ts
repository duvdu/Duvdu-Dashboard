import { type Message as ChatMessage } from "@/features/chat/types/chat.types";
import { type Socket } from "socket.io-client";

export type Message = ChatMessage;

export interface SocketContextValue {
  socket: Socket | null;
}
