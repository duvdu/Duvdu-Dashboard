import { lazy } from "react";

const ProjectReportListPage = lazy(
  () => import("./pages/project-report-list-page")
);
// const ProjectReviewDetailsPage = lazy(
//   () => import("./pages/project-review-details-page")
// );

export const projectReportRoutes = [
  {
    index: true,
    element: <ProjectReportListPage />,
  },

  // {
  //   path: ":id",
  //   element: <ProjectReviewDetailsPage />,
  // },
];
