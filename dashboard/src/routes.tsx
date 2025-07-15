import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import { authRoutes } from "./features/auth/routes";
import { dashboardRoutes } from "./features/dashboard/routes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"/dashboard"} />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [...dashboardRoutes],
  },
  {
    path: "/auth",
    children: authRoutes,
  },
]);
