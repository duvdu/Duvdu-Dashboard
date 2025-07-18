import { z } from 'zod';

export const complaintSchema = z.object({
  title: z.object({
    ar: z.string().min(1, 'Arabic title is required'),
    en: z.string().min(1, 'English title is required'),
  }),
  status: z.boolean(),
  createdAt: z.string().optional(),
});

export const feedbackSchema = z.object({
  feedback: z.string().min(1, 'Feedback is required'),
  sendNotification: z.boolean().optional(),
  closeComplaint: z.boolean().optional(),
});

export type ComplaintSchema = z.infer<typeof complaintSchema>;
export type FeedbackSchema = z.infer<typeof feedbackSchema>;
