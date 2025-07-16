import { type Message } from "./types/chat.types";

export const getOtherUser = (currentUserId: string, message: Message) => {
  const sender = message.sender;
  const receiver = message.receiver;
  if (!sender || !receiver) return null;
  if (sender._id === currentUserId) {
    return receiver;
  }
  return sender;
};
