import DashboardLayout from "@/components/layout/DashboardLayout";
import { NotAllowedPage } from "@/components/layout/NotAllowedPage";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";
import { PERMISSION_KEYS } from "@/config/permissions";
import { ServerCrashIcon } from "lucide-react";
import { lazy } from "react";
import { Outlet } from "react-router-dom";
import { adminsRoutes } from "../admins/routes";
import { cancelledContractRoutes } from "../cancelled-contracts/routes";
import { categoryRoutes } from "../categories/routes";
import { chatRoutes } from "../chat/routes";
import { complaintRoutes } from "../complaints/routes";
import { contractRoutes } from "../contracts/routes";
import { customPageRoutes } from "../custom-pages/routes";
import { projectRoutes } from "../cycles-projects/routes";
import { fundTransactionRoutes } from "../fund-transactions/routes";
import { rankRoutes } from "../ranks/routes";
import { rolesRoutes } from "../roles/routes";
import { settingsRoutes } from "../settings/routes";
import { ticketRoutes } from "../tickets/routes";
import { transactionsRoutes } from "../transactions/routes";
import { usersRoutes } from "../users/routes";
import { subscriptionsRoutes } from "../subscriptions/routes";

const DashboardPage = lazy(() => import("./pages/dashboard"));

export const dashboardRoutes = [
  {
    index: true,
    element: (
      <ProtectedRoute permissionKey={PERMISSION_KEYS.DASHBOARD.VIEW}>
        <DashboardPage />
      </ProtectedRoute>
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
    path: "contracts",
    element: (
      <ProtectedRoute permissionKey={PERMISSION_KEYS.CONTRACTS.VIEW}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: contractRoutes,
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
    path: "complaints",
    element: (
      <ProtectedRoute permissionKey={PERMISSION_KEYS.COMPLAINTS.VIEW}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: complaintRoutes,
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
    path: "tickets",
    element: (
      <ProtectedRoute permissionKey={PERMISSION_KEYS.TICKETS.VIEW}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: ticketRoutes,
  },
  {
    path: "custom-pages",
    element: (
      <ProtectedRoute permissionKey={PERMISSION_KEYS.CUSTOM_PAGES.VIEW}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: customPageRoutes,
  },
  {
    path: "transactions",

    element: (
      <ProtectedRoute permissionKey={PERMISSION_KEYS.TRANSACTIONS.VIEW}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: transactionsRoutes,
  },
  {
    path: "subscriptions",
    element: (
      <ProtectedRoute permissionKey={PERMISSION_KEYS.TRANSACTIONS.VIEW}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: subscriptionsRoutes,
  },
  {
    path: "fund-transactions",
    element: (
      <ProtectedRoute permissionKey={PERMISSION_KEYS.FUND_TRANSACTIONS.VIEW}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: fundTransactionRoutes,
  },
  {
    path: "cancelled-contracts",
    element: (
      <ProtectedRoute
        permissionKey={PERMISSION_KEYS.CONTRACTS.VIEW_CANCELED_CONTRACTS}
      >
        <Outlet />
      </ProtectedRoute>
    ),
    children: cancelledContractRoutes,
  },
  {
    path: "settings",
    element: (
      <ProtectedRoute permissionKey={PERMISSION_KEYS.SETTINGS.VIEW}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: settingsRoutes,
  },
  {
    path: "ranks",
    element: (
      <ProtectedRoute permissionKey={PERMISSION_KEYS.RANKS.VIEW}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: rankRoutes,
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
