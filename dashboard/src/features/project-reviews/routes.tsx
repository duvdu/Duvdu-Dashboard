import { lazy } from 'react';

const ProjectReviewListPage = lazy(() => import('./pages/project-review-list-page'));
const ProjectReviewCreatePage = lazy(() => import('./pages/project-review-create-page'));
const ProjectReviewUpdatePage = lazy(() => import('./pages/project-review-update-page'));
const ProjectReviewDetailsPage = lazy(() => import('./pages/project-review-details-page'));

export const projectReviewRoutes = [
  {
    index: true,
    element: <ProjectReviewListPage />
  },
  {
    path: 'create',
    element: <ProjectReviewCreatePage />
  },
  {
    path: 'update/:id',
    element: <ProjectReviewUpdatePage />
  },
  {
    path: ':id',
    element: <ProjectReviewDetailsPage />
  }
];
