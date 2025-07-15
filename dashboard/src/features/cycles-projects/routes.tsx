import { lazy } from "react";

const ProjectListPage = lazy(() => import("./pages/project-list-page"));
const ProjectDetailsPage = lazy(() => import("./pages/project-details-page"));

export const projectRoutes = [
  {
    index: true,
    element: <ProjectListPage />,
  },
  {
    path: ":id",
    element: <ProjectDetailsPage />,
  },
];
