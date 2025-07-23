import { lazy } from "react";

const CancelledContractListPage = lazy(
  () => import("./pages/cancelled-contract-list-page")
);

const CancelledContractDetailsPage = lazy(
  () => import("./pages/cancelled-contract-details-page")
);

export const cancelledContractRoutes = [
  {
    index: true,
    element: <CancelledContractListPage />,
  },
  {
    path: ":id",
    element: <CancelledContractDetailsPage />,
  },
];
