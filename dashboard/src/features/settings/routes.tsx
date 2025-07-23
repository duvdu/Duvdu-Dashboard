import { lazy } from "react";

const SettingsUpdatePage = lazy(() => import("./pages/setting-update-page"));

export const settingsRoutes = [
  {
    index: true,
    element: <SettingsUpdatePage />,
  },
];
