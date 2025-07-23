import { lazy } from "react";

const AdminListPage = lazy(() => import("./pages/admin-list-page"));
const AdminDetailsPage = lazy(() => import("./pages/admin-details-page"));

export const adminsRoutes = [
  {
    index: true,
    element: <AdminListPage />,
  },
  {
    path: ":id",
    element: <AdminDetailsPage />,
  },
];
