import axios from "../../../lib/axios";
import type { TransactionsListResponse } from "../types/transaction.types";

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
