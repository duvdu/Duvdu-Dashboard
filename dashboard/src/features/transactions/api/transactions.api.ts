import axios from "../../../lib/axios";
import type { TransactionsListResponse } from "../types/transaction.types";
import type { TransactionsAnalysisResponse } from "../types/transaction.types";

export const getTransactions = async ({
  user,
  page,
  limit,
  type,
  status,
  from,
  to,
  isSubscribed,
  ticketNumber,
  contract,
}: {
  user?: string;
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  from?: string;
  to?: string;
  isSubscribed?: boolean;
  ticketNumber?: string;
  contract?: string;
}) => {
  const { data } = await axios.get<TransactionsListResponse>(
    "/api/payment/transactions/crm",
    {
      params: {
        user,
        page,
        limit,
        type,
        status,
        from,
        to,
        isSubscription: isSubscribed,
        ticketNumber,
        contract,
      },
    }
  );
  return data;
};

export const fundTransaction = async (
  transactionId: string,
  fundingAmount: number,
  attachment?: File
) => {
  const formData = new FormData();
  formData.append("fundingAmount", fundingAmount.toString());
  if (attachment) {
    console.log("attachment", attachment);
    formData.append("fundAttachment", attachment);
  }
  const { data } = await axios.patch(
    `/api/payment/transactions/crm/${transactionId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

export const getTransactionsAnalysis = async (params: {
  interval?: "today" | "week" | "month" | "custom";
  from?: string;
  to?: string;
  currency?: string;
}): Promise<TransactionsAnalysisResponse> => {
  const { data } = await axios.get<TransactionsAnalysisResponse>(
    "/api/analysis/payment/transactions-analysis",
    { params }
  );
  return data;
};
