import type { User } from "@/features/chat";

export type ContractReview = {
  _id?: string;
  title: { ar: string; en: string };
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
  user?: User;
  project?: string;
  contract?: string;
  cycle?: string;
  rate?: number;
  comment?: string;
  __v?: number;
};
