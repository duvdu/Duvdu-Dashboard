import { z } from "zod";

export const projectFilterSchema = z.object({
  search: z.string().optional(),
  keyword: z.string().optional(),
  status: z
    .enum(["pending", "approved", "rejected", "paused", "deleted", "all"])
    .optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z
    .enum(["name", "createdAt", "updatedAt", "favouriteCount", "duration"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const projectStatusUpdateSchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "paused", "deleted"]),
  reason: z.string().optional(),
});

export const projectActionSchema = z.object({
  action: z.enum(["approve", "reject", "pause", "delete", "restore"]),
  reason: z.string().optional(),
});

export type ProjectFilterSchema = z.infer<typeof projectFilterSchema>;
export type ProjectStatusUpdateSchema = z.infer<
  typeof projectStatusUpdateSchema
>;
export type ProjectActionSchema = z.infer<typeof projectActionSchema>;
