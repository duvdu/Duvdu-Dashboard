import { lazy } from "react";

const CustomPageListPage = lazy(() => import("./pages/custom-page-list-page"));
const CustomPageCreatePage = lazy(
  () => import("./pages/custom-page-create-page")
);
const CustomPageUpdatePage = lazy(
  () => import("./pages/custom-page-update-page")
);
const CustomPageDetailsPage = lazy(
  () => import("./pages/custom-page-details-page")
);

export const customPageRoutes = [
  {
    index: true,
    element: <CustomPageListPage />,
  },
  {
    path: "create",
    element: <CustomPageCreatePage />,
  },
  {
    path: "update/:id",
    element: <CustomPageUpdatePage />,
  },
  {
    path: ":id",
    element: <CustomPageDetailsPage />,
  },
];
