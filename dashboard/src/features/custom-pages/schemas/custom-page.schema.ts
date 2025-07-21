import { z } from "zod";

export const customPageSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

export type CustomPageSchema = z.infer<typeof customPageSchema>;
