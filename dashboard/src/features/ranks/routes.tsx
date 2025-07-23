import { lazy } from 'react';

const RankListPage = lazy(() => import('./pages/rank-list-page'));
const RankCreatePage = lazy(() => import('./pages/rank-create-page'));
const RankUpdatePage = lazy(() => import('./pages/rank-update-page'));
const RankDetailsPage = lazy(() => import('./pages/rank-details-page'));

export const rankRoutes = [
  {
    index: true,
    element: <RankListPage />
  },
  {
    path: 'create',
    element: <RankCreatePage />
  },
  {
    path: 'update/:id',
    element: <RankUpdatePage />
  },
  {
    path: ':id',
    element: <RankDetailsPage />
  }
];
