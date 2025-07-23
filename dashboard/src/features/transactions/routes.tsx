import { lazy } from "react";

const TransactionsListPage = lazy(
  () => import("./pages/transactions-list-page")
);

export const transactionsRoutes = [
  {
    index: true,
    element: <TransactionsListPage />,
  },
];
