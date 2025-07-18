import { z } from "zod";

const cycleTypeSchema = z.enum(["video", "image", "audio"]);

export const tagSchema = z.object({
  _id: z.string().optional(),
  ar: z.string().min(1, "Arabic tag is required"),
  en: z.string().min(1, "English tag is required"),
});

export const subCategorySchema = z.object({
  _id: z.string().optional(),
  title: z.object({
    ar: z.string().min(1, "Arabic subcategory title is required"),
    en: z.string().min(1, "English subcategory title is required"),
  }),
  tags: z
    .array(tagSchema)
    .min(1, "At least one tag is required for each subcategory"),
});

export const jobTitleSchema = z.object({
  _id: z.string().optional(),
  ar: z.string().min(1, "Arabic job title is required"),
  en: z.string().min(1, "English job title is required"),
});

export const categorySchema = z
  .object({
    title: z.object({
      ar: z.string().min(1, "Arabic title is required"),
      en: z.string().min(1, "English title is required"),
    }),
    jobTitles: z.array(jobTitleSchema).optional(),
    cycle: z.string().min(1, "Cycle is required"),
    media_type: cycleTypeSchema,
    subCategories: z
      .array(subCategorySchema)
      .min(1, "At least one subcategory is required"),
    status: z.boolean(),
    image: z.union([z.string(), z.instanceof(File)]).refine((val) => {
      if (!val) return false;
      if (val instanceof File) {
        return val.size > 0;
      }
      return true;
    }, "Image is required"),
    trend: z.boolean().optional(),
    isRelated: z.boolean().optional(),
    insurance: z.boolean().optional(),
  })
  .refine((data) => !(data.cycle === "project" && !data.media_type), {
    message: "Media type is required for project cycle",
    path: ["media_type"],
  });

export type CategorySchema = z.infer<typeof categorySchema>;
