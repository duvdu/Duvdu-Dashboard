import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { RBACProvider } from "./contexts/RBACProvider";
import { authRoutes } from "./features/auth/routes";
import { dashboardRoutes } from "./features/dashboard/routes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"/dashboard"} />,
  },
  {
    path: "/dashboard",
    element: (
      <RBACProvider>
        <Outlet />
      </RBACProvider>
    ),
    children: [...dashboardRoutes],
  },
  {
    path: "/auth",
    children: authRoutes,
  },
]);
