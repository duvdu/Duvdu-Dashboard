import { lazy } from "react";

const AdminListPage = lazy(() => import("./pages/admin-list-page"));

export const adminsRoutes = [
  {
    index: true,
    element: <AdminListPage />,
  },
];
