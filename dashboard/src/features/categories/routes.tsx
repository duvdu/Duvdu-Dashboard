import { lazy } from "react";

const CategoryListPage = lazy(() => import("./pages/category-list-page"));
const CategoryCreatePage = lazy(() => import("./pages/category-create-page"));
const CategoryUpdatePage = lazy(() => import("./pages/category-update-page"));
const CategoryDetailsPage = lazy(() => import("./pages/category-details-page"));

export const categoryRoutes = [
  {
    index: true,
    element: <CategoryListPage />,
  },
  {
    path: "create",
    element: <CategoryCreatePage />,
  },
  {
    path: "update/:id",
    element: <CategoryUpdatePage />,
  },
  {
    path: ":id",
    element: <CategoryDetailsPage />,
  },
];
