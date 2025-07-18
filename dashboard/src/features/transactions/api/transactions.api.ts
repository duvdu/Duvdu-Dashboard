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
}: {
  user?: string;
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  from?: string;
  to?: string;
  isSubscribed?: boolean;
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
        isSubscribed,
      },
    }
  );
  return data;
};
