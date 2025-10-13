import { z } from "zod";

export const adminSchema = z.object({
  // coverImage: z.union([z.instanceof(File), z.string()]).nullable(),
  // profileImage: z.union([z.instanceof(File), z.string()]).nullable(),
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  username: z
    .string()
    .min(6, "Username must be at least 6 characters")
    .max(32, "Username must be less than 32 characters"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number , and one special character"
    ),
  role: z.string().min(1, "Role is required"),
});

export const updateAdminSchema = adminSchema.extend({
  password: z.string().optional(),
});

export type CreateAdminSchema = z.infer<typeof adminSchema>;
export type UpdateAdminSchema = z.infer<typeof adminSchema>;
