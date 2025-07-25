import { lazy } from "react";

const SubscriptionsListPage = lazy(
  () => import("./pages/subscriptions-list-page")
);

export const subscriptionsRoutes = [
  {
    index: true,
    element: <SubscriptionsListPage />,
  },
];
