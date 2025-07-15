import { lazy } from "react";

const Login = lazy(() => import("./pages/login"));

export const authRoutes = [
  {
    path: "login",
    element: <Login />,
  },
];
