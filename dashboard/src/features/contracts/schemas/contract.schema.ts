import { z } from 'zod';

export const contractSchema = z.object({
  title: z.object({
    ar: z.string().min(1, 'Arabic title is required'),
    en: z.string().min(1, 'English title is required'),
  }),
  status: z.boolean(),
  createdAt: z.string().optional(),
});

export type ContractSchema = z.infer<typeof contractSchema>;
