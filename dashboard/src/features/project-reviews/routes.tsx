import { lazy } from "react";

const ProjectReviewListPage = lazy(
  () => import("./pages/project-review-list-page")
);
const ProjectReviewDetailsPage = lazy(
  () => import("./pages/project-review-details-page")
);

export const projectReviewRoutes = [
  {
    index: true,
    element: <ProjectReviewListPage />,
  },

  {
    path: ":id",
    element: <ProjectReviewDetailsPage />,
  },
];
