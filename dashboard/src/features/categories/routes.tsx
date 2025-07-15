import { lazy } from "react";

// Route-level RBAC protection is handled by the parent ProtectedRoute component
// Individual page protection is handled by ProtectedComponent in each component
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
