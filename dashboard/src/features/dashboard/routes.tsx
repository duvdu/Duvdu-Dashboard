import DashboardLayout from "@/components/layout/DashboardLayout";
import { NotAllowedPage } from "@/components/layout/NotAllowedPage";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";
import { PERMISSION_KEYS } from "@/config/permissions";
import { ServerCrashIcon } from "lucide-react";
import { lazy } from "react";
import { Outlet } from "react-router-dom";
import { adminsRoutes } from "../admins/routes";
import { categoryRoutes } from "../categories/routes";
import { chatRoutes } from "../chat/routes";
import { projectRoutes } from "../cycles-projects/routes";
import { rolesRoutes } from "../roles/routes";
import { usersRoutes } from "../users/routes";

const DashboardPage = lazy(() => import("./pages/dashboard"));

export const dashboardRoutes = [
  {
    index: true,
    element: (
      // <ProtectedRoute permissionKey={PERMISSION_KEYS.DASHBOARD.VIEW}>
      <DashboardPage />
      // </ProtectedRoute>
    ),
  },
  {
    path: "not-allowed",
    element: <NotAllowedPage />,
  },
  {
    path: "categories",
    element: (
      <ProtectedRoute permissionKey={PERMISSION_KEYS.CATEGORIES.VIEW}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: categoryRoutes,
  },
  {
    path: "chat",
    element: <Outlet />,
    children: chatRoutes,
  },

  {
    path: "projects",
    element: (
      <ProtectedRoute permissionKey={PERMISSION_KEYS.PROJECTS.VIEW}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: projectRoutes,
  },
  {
    path: "users",
    element: (
      <ProtectedRoute permissionKey={PERMISSION_KEYS.USERS.VIEW}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: usersRoutes,
  },
  {
    path: "roles",
    element: (
      <ProtectedRoute permissionKey={PERMISSION_KEYS.ROLES.VIEW}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: rolesRoutes,
  },
  {
    path: "admins",
    element: (
      <ProtectedRoute permissionKey={PERMISSION_KEYS.ADMINS.VIEW}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: adminsRoutes,
  },
  {
    path: "*",
    element: (
      <DashboardLayout className="flex-1">
        <div className="flex-1 flex flex-col gap-4 items-center justify-center">
          <ServerCrashIcon className="w-10 h-10" />
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">Page Not found</h1>
            <p className="text-sm text-muted-foreground">
              The page you are looking for does not exist.
            </p>
          </div>
        </div>
      </DashboardLayout>
    ),
  },
];
