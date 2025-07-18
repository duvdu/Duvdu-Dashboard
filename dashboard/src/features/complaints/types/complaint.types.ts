import type { User } from "@/features/chat";

export type Complaint = {
  _id: string;
  contract: string;
  createdAt: string;
  updatedAt: string;
  reporter: User;
  attachments: string[];
  state: Array<{
    addedBy: User;
    feedback: string | null;
  }>;
  closedBy: null | User;
  ticketNumber: string;
};
