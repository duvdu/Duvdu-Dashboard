import { z } from "zod";
import { getGroupedPermissionsForForm } from "../constants/permissions";

const allPermissions = Object.values(getGroupedPermissionsForForm()).flat();

export const roleSchema = z.object({
  key: z.string().min(2, "Role key is required"),
  permissions: z
    .array(z.string())
    .refine((perms) => perms.every((p) => allPermissions.includes(p)), {
      message: "Invalid permission selected",
    }),
});

export type RoleSchema = z.infer<typeof roleSchema>;
