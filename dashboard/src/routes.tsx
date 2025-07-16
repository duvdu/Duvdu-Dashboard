import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { RBACProvider } from "./contexts/RBACProvider";
import { SocketProvider } from "./contexts/SocketProvider";
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
        <SocketProvider>
          <Outlet />
        </SocketProvider>
      </RBACProvider>
    ),
    children: [...dashboardRoutes],
  },
  {
    path: "/auth",
    children: authRoutes,
  },
]);
