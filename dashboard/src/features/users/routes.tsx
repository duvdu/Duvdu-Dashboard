import { lazy } from "react";

const UserListPage = lazy(() => import("./pages/user-list-page"));
const UserProfilePage = lazy(() => import("./pages/user-profile-page"));

export const usersRoutes = [
  {
    index: true,
    element: <UserListPage />,
  },
  {
    path: ":id",
    element: <UserProfilePage />,
  },
];
