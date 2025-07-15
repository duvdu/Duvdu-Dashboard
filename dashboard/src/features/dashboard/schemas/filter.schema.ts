import { z } from "zod";

export const dashboardFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  userType: z.enum(["client", "service_provider", "all"]).default("all"),
});

export type DashboardFilterSchema = z.infer<typeof dashboardFilterSchema>;
