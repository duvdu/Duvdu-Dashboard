import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";
import { PERMISSION_KEYS } from "@/config/permissions";
import { lazy } from "react";
import { Navigate, Outlet } from "react-router-dom";
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
    element: <Navigate to="home" replace />,
  },
  {
    path: "home",
    element: (
      <ProtectedRoute permissionKey={PERMISSION_KEYS.DASHBOARD.VIEW}>
        <DashboardPage />
      </ProtectedRoute>
    ),
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
  ...chatRoutes.map((route) => ({
    ...route,
    element: (
      <ProtectedRoute permissionKey={PERMISSION_KEYS.CHAT.VIEW}>
        <Outlet />
      </ProtectedRoute>
    ),
  })),
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
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-2xl font-bold">Page Not found</h1>
        </div>
      </DashboardLayout>
    ),
  },
];
