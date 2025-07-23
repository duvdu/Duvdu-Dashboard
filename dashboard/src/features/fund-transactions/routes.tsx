import { lazy } from "react";

const FundTransactionListPage = lazy(
  () => import("./pages/fund-transaction-list-page")
);
const FundTransactionCreatePage = lazy(
  () => import("./pages/fund-transaction-create-page")
);

const FundTransactionDetailsPage = lazy(
  () => import("./pages/fund-transaction-details-page")
);

export const fundTransactionRoutes = [
  {
    index: true,
    element: <FundTransactionListPage />,
  },
  {
    path: "create",
    element: <FundTransactionCreatePage />,
  },

  {
    path: ":id",
    element: <FundTransactionDetailsPage />,
  },
];
