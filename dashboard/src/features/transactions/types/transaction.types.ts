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
  ticketNumber?: string;
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

export interface TransactionsAnalysisResponse {
  message: string;
  summary: {
    totalRevenue: number;
    totalFundedRevenue: number;
    totalFundedFromFundedTransactions: number;
    totalPendingFunded: number;
    totalTransactions: number;
    totalFundedTransactions: number;
    averageTransactionValue: number;
    fundingRate: number;
  };
  revenueAnalysis: {
    deposits: {
      total: number;
      funded: number;
      pending: number;
      success: number;
      failed: number;
    };
    withdraws: {
      total: number;
      funded: number;
      pending: number;
      success: number;
      failed: number;
    };
  };
  fundedTransactionsAnalysis: {
    totalAmount: number;
    pendingAmount: number;
    successAmount: number;
    failedAmount: number;
    totalCount: number;
    pendingCount: number;
    successCount: number;
    failedCount: number;
  };
  timeSeriesData: Array<{
    revenue: number;
    fundedRevenue: number;
    transactionCount: number;
    fundedCount: number;
    date: string;
  }>;
  topMetrics: {
    highestTransaction: number;
    lowestTransaction: number;
    mostCommonCurrency: string;
  };
  growthMetrics: {
    revenueGrowth: number;
    transactionGrowth: number;
    fundingGrowth: number;
  };
  currencyBreakdown: Array<{
    totalRevenue: number;
    fundedRevenue: number;
    transactionCount: number;
    currency: string;
  }>;
}
