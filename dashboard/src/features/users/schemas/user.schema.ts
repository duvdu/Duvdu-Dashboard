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

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  username: z
    .string()
    .min(6, "Username must be at least 6 characters")
    .max(32, "Username must be less than 32 characters"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  availableContracts: z
    .number()
    .min(0, "Available contracts must be 0 or greater"),
  profileImage: z.union([z.instanceof(File), z.string()]).nullable(),
  coverImage: z.union([z.instanceof(File), z.string()]).nullable(),
});

export const userBlockSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
});

export const userUnblockSchema = z.object({
  reason: z.string().optional(),
});

export type UserSchema = z.infer<typeof userSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
