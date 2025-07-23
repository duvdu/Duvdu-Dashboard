import { z } from "zod";

export const defaultsUpdateSchema = z.object({
  profile: z.instanceof(File, { message: "Profile image is required" }),
  cover: z.instanceof(File, { message: "Cover image is required" }),
});

export type DefaultsUpdateFormValues = z.infer<typeof defaultsUpdateSchema>;
