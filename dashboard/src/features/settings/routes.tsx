import { lazy } from "react";

const SettingsDetailsPage = lazy(() => import("./pages/setting-details-page"));

export const settingsRoutes = [
  {
    index: true,
    element: <SettingsDetailsPage />,
  },
];
