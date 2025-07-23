import { z } from "zod";

export const rankSchema = z.object({
  rank: z.string().min(1, "Rank name is required"),
  actionCount: z.number().min(0, "Contracts count is required"),
  projectsCount: z.number().min(0, "Projects count is required"),
  projectsLiked: z.number().min(0, "Projects liked is required"),
  color: z.string().min(1, "Color is required"),
});

export type RankSchema = z.infer<typeof rankSchema>;
