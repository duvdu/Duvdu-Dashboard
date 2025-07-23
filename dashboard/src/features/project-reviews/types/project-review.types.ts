import type { User } from "@/features/chat";

export type ProjectReview = {
  _id?: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
  user?: User;
  project?: string;
  cycle?: string;
  rate?: number;
  comment?: string;
  __v?: number;
};
