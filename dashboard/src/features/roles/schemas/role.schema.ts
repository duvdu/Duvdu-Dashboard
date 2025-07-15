import { z } from "zod";
import { PERMISSIONS } from "../constants/permissions";

const allPermissions = Object.values(PERMISSIONS).flat();

export const roleSchema = z.object({
  key: z.string().min(2, "Role key is required"),
  permissions: z
    .array(z.string())
    .refine((perms) => perms.every((p) => allPermissions.includes(p)), {
      message: "Invalid permission selected",
    }),
});

export type RoleSchema = z.infer<typeof roleSchema>;
