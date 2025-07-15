import { z } from "zod";

export const sendMessageSchema = z.object({
  content: z.string().min(1, "Message content is required"),
  receiver: z.string().min(1, "Receiver is required"),
  attachments: z
    .any()
    .optional()
    .refine(
      (files) =>
        !files ||
        (files instanceof FileList && files.length > 0) ||
        (Array.isArray(files) && files.length > 0),
      {
        message: "At least one attachment is required if provided",
        path: ["attachments"],
      }
    ),
});

export type SendMessageForm = z.infer<typeof sendMessageSchema>;
