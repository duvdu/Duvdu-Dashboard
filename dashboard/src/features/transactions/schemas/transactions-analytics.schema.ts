import { z } from "zod";

export const transactionsAnalyticsSchema = z.object({
  interval: z.enum(["today", "week", "month", "custom"]).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  currency: z.string().optional(),
});

export type TransactionsAnalyticsSchema = z.infer<
  typeof transactionsAnalyticsSchema
>;
