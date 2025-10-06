import type { User } from "@/features/chat";

export type Ticket = {
  _id?: string;
  id?: string;
  title: { ar: string; en: string };
  status: boolean;
  createdAt?: string;
  state?: {
    isClosed?: boolean;
    feedback?: string;
  };
  user?: User;
  userId?: User;
  name?: string;
  ticketNumber?: string;
  message?: string;
};
