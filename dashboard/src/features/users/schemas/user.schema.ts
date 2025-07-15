import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  type: z.enum(["customer", "provider", "admin"]),
  status: z.enum(["active", "pending", "suspended"]),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});

export const userBlockSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
});

export const userUnblockSchema = z.object({
  reason: z.string().optional(),
});

export type UserSchema = z.infer<typeof userSchema>;
