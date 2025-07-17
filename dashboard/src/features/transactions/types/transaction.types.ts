import type { User } from "@/features/chat";

export interface Transaction {
  _id: string;
  isSubscription: boolean;
  type: "deposit" | "withdraw";
  currency: string;
  amount: number;
  user: User;
  contract: string;
  status: "pending" | "success" | "failed";
  model: string;
  timeStamp: string;
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
