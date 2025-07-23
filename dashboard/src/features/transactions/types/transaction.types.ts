import type { User } from "@/features/chat";

export interface Transaction {
  _id: string;
  isSubscription: boolean;
  type: "deposit" | "withdraw";
  currency: string;
  amount: number;
  user: User;
  contract: string;
  status: "pending" | "success" | "failed" | "funded";
  model: string;
  timeStamp: string;
  fundingAmount?: number;
}

export interface Pagination {
  currentPage: number;
  resultCount: number;
  totalPages: number;
}

export interface TransactionResponse {
  data: Transaction;
}

export interface TransactionsListResponse {
  data: Transaction[];
  pagination: Pagination;
}
