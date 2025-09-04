import { z } from "zod";

export const projectFilterSchema = z.object({
  search: z.string().optional(),
  keyword: z.string().optional(),
  status: z
    .enum(["pending", "approved", "rejected", "paused", "deleted", "all"])
    .optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z
    .enum(["name", "createdAt", "updatedAt", "favouriteCount", "duration"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const projectStatusUpdateSchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "paused", "deleted"]),
  reason: z.string().optional(),
});

export const projectActionSchema = z.object({
  action: z.enum(["approve", "reject", "pause", "delete", "restore"]),
  reason: z.string().optional(),
});

export const projectScaleSchema = z.object({
  unit: z.enum(["image", "seconds", "minutes", "hours", "episodes"]).optional(),
  pricerPerUnit: z.string().min(1),
  minimum: z.string().min(1),
  current: z.string().min(1),
  maximum: z.string().min(1),
});

export const toolSchema = z.object({
  name: z.string(),
  unitPrice: z.number().min(0),
});

export const functionSchema = z.object({
  name: z.string(),
  unitPrice: z.number().min(0),
});

export const locationSchema = z.object({
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
});

export const projectFormSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1),
    duration: z.string().min(1),
    address: z.string().min(1),
    attachments: z.array(z.any()).min(1),
    cover: z.any().optional(),
    audioCover: z.array(z.any()).optional(),
    location: locationSchema,
    tools: z.array(toolSchema).optional(),
    functions: z.array(functionSchema).optional(),
    searchKeyWords: z.array(z.string()).optional(),
    showOnHome: z.boolean().optional(),
    projectScale: projectScaleSchema,
    categoryMedia: z.enum(["audio", "video", "image"]).optional(),
  })
  .superRefine((values, ctx) => {
    if (!values.categoryMedia) return;

    const hasTypeMatch = (
      file: unknown,
      media: "audio" | "video" | "image"
    ) => {
      if (!file) return false;
      if (typeof File !== "undefined" && file instanceof File) {
        const mime = (file as File).type || "";
        return mime.startsWith(`${media}/`);
      }
      if (typeof file === "string") {
        const url = file.toLowerCase();
        const byExt = (exts: string[]) => exts.some((e) => url.endsWith(e));
        if (media === "image")
          return byExt([
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".webp",
            ".bmp",
            ".svg",
          ]);
        if (media === "audio")
          return byExt([".mp3", ".wav", ".aac", ".m4a", ".ogg", ".flac"]);
        if (media === "video")
          return byExt([".mp4", ".mov", ".avi", ".mkv", ".webm", ".m4v"]);
      }
      return false;
    };

    const matches = (values.attachments || []).some((f) =>
      hasTypeMatch(f, values.categoryMedia as "audio" | "video" | "image")
    );

    if (!matches) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["attachments"],
        message: `At least one ${values.categoryMedia} attachment is required`,
      });
    }

    if (values.categoryMedia === "audio") {
      const cover = values.audioCover || [];
      const hasImageCover = cover.some((file) => {
        if (!file) return false;
        if (typeof File !== "undefined" && file instanceof File) {
          return (file as File).type.startsWith("image/");
        }
        if (typeof file === "string") {
          const url = file.toLowerCase();
          return [
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".webp",
            ".bmp",
            ".svg",
          ].some((ext) => url.endsWith(ext));
        }
        return false;
      });
      if (!hasImageCover) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["audioCover"],
          message: "Audio cover image is required when media is audio",
        });
      }
    }

    const unit = values.projectScale?.unit;
    if (unit) {
      if (values.categoryMedia === "image") {
        if (unit !== "image") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["projectScale", "unit"],
            message: "Unit must be 'image' when media type is image",
          });
        }
      }
      if (
        values.categoryMedia === "video" ||
        values.categoryMedia === "audio"
      ) {
        const allowed = ["seconds", "minutes", "hours", "episodes"] as const;
        if (!(allowed as readonly string[]).includes(unit)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["projectScale", "unit"],
            message:
              "Unit must be one of seconds, minutes, hours, episodes for video/audio",
          });
        }
      }
    }
  });

export type ProjectFilterSchema = z.infer<typeof projectFilterSchema>;
export type ProjectStatusUpdateSchema = z.infer<
  typeof projectStatusUpdateSchema
>;
export type ProjectActionSchema = z.infer<typeof projectActionSchema>;
export type ProjectFormSchema = z.infer<typeof projectFormSchema>;
