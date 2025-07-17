import { lazy } from 'react';

const ContractListPage = lazy(() => import('./pages/contract-list-page'));
const ContractCreatePage = lazy(() => import('./pages/contract-create-page'));
const ContractUpdatePage = lazy(() => import('./pages/contract-update-page'));
const ContractDetailsPage = lazy(() => import('./pages/contract-details-page'));

export const contractRoutes = [
  {
    index: true,
    element: <ContractListPage />
  },
  {
    path: 'create',
    element: <ContractCreatePage />
  },
  {
    path: 'update/:id',
    element: <ContractUpdatePage />
  },
  {
    path: ':id',
    element: <ContractDetailsPage />
  }
];
