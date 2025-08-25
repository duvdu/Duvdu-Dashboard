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

export const projectScaleSchema = z.object({
  unit: z.enum(["seconds", "minutes", "hours", "episodes"]),
  pricerPerUnit: z.string().min(1),
  minimum: z.string().min(1),
  current: z.string().min(1),
  maximum: z.string().min(1),
});

export const toolSchema = z.object({
  name: z.string(),
  unitPrice: z.number().min(0),
});

export const functionSchema = z.object({
  name: z.string(),
  unitPrice: z.number().min(0),
});

export const locationSchema = z.object({
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
});

export const projectFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  duration: z.string().min(1),
  address: z.string().min(1),
  attachments: z.array(z.any()).min(1),
  cover: z.any().optional(),
  audioCover: z.array(z.any()).optional(),
  location: locationSchema,
  tools: z.array(toolSchema).optional(),
  functions: z.array(functionSchema).optional(),
  searchKeyWords: z.array(z.string()).optional(),
  showOnHome: z.boolean().optional(),
  projectScale: projectScaleSchema,
});

export type ProjectFilterSchema = z.infer<typeof projectFilterSchema>;
export type ProjectStatusUpdateSchema = z.infer<
  typeof projectStatusUpdateSchema
>;
export type ProjectActionSchema = z.infer<typeof projectActionSchema>;
export type ProjectFormSchema = z.infer<typeof projectFormSchema>;
