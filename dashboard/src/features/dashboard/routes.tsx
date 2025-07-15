import DashboardLayout from "@/components/layout/DashboardLayout";
import { lazy } from "react";
import { adminsRoutes } from "../admins/routes";
import { categoryRoutes } from "../categories/routes";
import { projectRoutes } from "../cycles-projects/routes";
import { rolesRoutes } from "../roles/routes";
import { usersRoutes } from "../users/routes";

const DashboardPage = lazy(() => import("./pages/dashboard"));

export const dashboardRoutes = [
  {
    index: true,
    element: <DashboardPage />,
  },
  {
    path: "categories",
    children: categoryRoutes,
  },
  {
    path: "projects",
    children: projectRoutes,
  },
  {
    path: "users",
    children: usersRoutes,
  },
  {
    path: "roles",
    children: rolesRoutes,
  },
  {
    path: "admins",
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
