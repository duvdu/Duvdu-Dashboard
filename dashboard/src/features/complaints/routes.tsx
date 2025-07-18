import { lazy } from 'react';

const ComplaintListPage = lazy(() => import('./pages/complaint-list-page'));
const ComplaintCreatePage = lazy(() => import('./pages/complaint-create-page'));
const ComplaintUpdatePage = lazy(() => import('./pages/complaint-update-page'));
const ComplaintDetailsPage = lazy(() => import('./pages/complaint-details-page'));

export const complaintRoutes = [
  {
    index: true,
    element: <ComplaintListPage />
  },
  {
    path: 'create',
    element: <ComplaintCreatePage />
  },
  {
    path: 'update/:id',
    element: <ComplaintUpdatePage />
  },
  {
    path: ':id',
    element: <ComplaintDetailsPage />
  }
];
