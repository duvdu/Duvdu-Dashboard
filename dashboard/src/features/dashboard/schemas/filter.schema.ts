import { z } from "zod";

export const dashboardFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  userType: z.enum(["client", "service_provider", "all"]).default("all"),
  interval: z.enum(["today", "week", "month", "custom"]).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  currency: z.string().optional(),
});

export type DashboardFilterSchema = z.infer<typeof dashboardFilterSchema>;
