import { z } from "zod";

export const roleSchema = z.object({
  key: z.string().min(2, "Role key is required"),
  permissions: z.array(z.string()),
});

export type RoleSchema = z.infer<typeof roleSchema>;
