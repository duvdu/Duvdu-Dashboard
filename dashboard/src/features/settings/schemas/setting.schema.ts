import { z } from "zod";

export const settingSchema = z.object({
  expirationTime: z.array(z.number()),
  contractSubscriptionPercentage: z.number().min(0).max(100),
  default_profile: z.union([z.string(), z.instanceof(File)]),
  default_cover: z.union([z.string(), z.instanceof(File)]),
});

export type SettingsSchema = z.infer<typeof settingSchema>;
