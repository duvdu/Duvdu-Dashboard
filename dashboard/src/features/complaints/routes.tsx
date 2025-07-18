import { lazy } from "react";

const ComplaintListPage = lazy(() => import("./pages/complaint-list-page"));
const ComplaintDetailsPage = lazy(
  () => import("./pages/complaint-details-page")
);

export const complaintRoutes = [
  {
    index: true,
    element: <ComplaintListPage />,
  },

  {
    path: ":id",
    element: <ComplaintDetailsPage />,
  },
];
