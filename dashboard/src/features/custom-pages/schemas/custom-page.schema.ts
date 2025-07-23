import { z } from "zod";

export const customPageSchema = z.object({
  titleEn: z.string().min(1, "Title (English) is required"),
  titleAr: z.string().min(1, "Title (Arabic) is required"),
  contentEn: z.string().min(1, "Content (English) is required"),
  contentAr: z.string().min(1, "Content (Arabic) is required"),
});

export type CustomPageSchema = z.infer<typeof customPageSchema>;
