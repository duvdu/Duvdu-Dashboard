import { lazy } from "react";
import { projectReviewRoutes } from "../project-reviews/routes";

const ProjectListPage = lazy(() => import("./pages/project-list-page"));
const ProjectDetailsPage = lazy(() => import("./pages/project-details-page"));
const ProjectUpdatePage = lazy(() => import("./pages/project-update-page"));

export const projectRoutes = [
  {
    index: true,
    element: <ProjectListPage />,
  },
  {
    path: ":id",
    element: <ProjectDetailsPage />,
  },
  {
    path: ":id/update",
    element: <ProjectUpdatePage />,
  },
  {
    path: "reviews",
    children: projectReviewRoutes,
  },
];
