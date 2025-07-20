import { lazy } from "react";

const TicketListPage = lazy(() => import("./pages/ticket-list-page"));
const TicketDetailsPage = lazy(() => import("./pages/ticket-details-page"));

export const ticketRoutes = [
  {
    index: true,
    element: <TicketListPage />,
  },

  {
    path: ":id",
    element: <TicketDetailsPage />,
  },
];
