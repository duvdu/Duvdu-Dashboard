import { z } from "zod";

export const chatFilterSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "lastMessage"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  isArchived: z.boolean().optional(),
  isPinned: z.boolean().optional(),
});

export const messageFilterSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  messageType: z.enum(["text", "image", "video", "audio", "file"]).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export const sendMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Message content is required")
    .max(5000, "Message content is too long"),
  receiver: z.string().min(1, "Receiver is required"),
  attachments: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (!files) return true;
        if (files instanceof FileList) {
          return Array.from(files).every(
            (file) => file instanceof File && file.size <= 10 * 1024 * 1024
          ); // 10MB limit
        }
        if (Array.isArray(files)) {
          return files.every(
            (file) => file instanceof File && file.size <= 10 * 1024 * 1024
          ); // 10MB limit
        }
        return false;
      },
      {
        message: "Each attachment must be a file under 10MB",
      }
    ),
  replyTo: z.string().optional(),
  messageType: z.enum(["text", "image", "video", "audio", "file"]).optional(),
});

export const updateMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Message content is required")
    .max(5000, "Message content is too long")
    .optional(),
  attachments: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (!files) return true;
        if (files instanceof FileList) {
          return Array.from(files).every(
            (file) => file instanceof File && file.size <= 10 * 1024 * 1024
          ); // 10MB limit
        }
        if (Array.isArray(files)) {
          return files.every(
            (file) => file instanceof File && file.size <= 10 * 1024 * 1024
          ); // 10MB limit
        }
        return false;
      },
      {
        message: "Each attachment must be a file under 10MB",
      }
    ),
  reactions: z
    .array(
      z.object({
        type: z.string().min(1, "Reaction type is required"),
      })
    )
    .optional(),
});

export const markMessagesAsWatchedSchema = z.object({
  messages: z
    .array(z.string().min(1, "Message ID is required"))
    .min(1, "At least one message ID is required"),
});

export const chatSearchSchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .max(100, "Search query is too long"),
  searchType: z.enum(["users", "messages", "content"]).optional(),
  filters: chatFilterSchema.optional(),
});

export const messageSearchSchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .max(100, "Search query is too long"),
  chatId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  messageType: z.enum(["text", "image", "video", "audio", "file"]).optional(),
});

export const chatActionSchema = z.object({
  action: z.enum([
    "archive",
    "unarchive",
    "pin",
    "unpin",
    "mute",
    "unmute",
    "delete",
  ]),
  duration: z.number().min(1).optional(), // For mute duration in minutes
});

export const bulkChatActionSchema = z.object({
  chatIds: z
    .array(z.string().min(1, "Chat ID is required"))
    .min(1, "At least one chat ID is required"),
  action: z.enum(["archive", "unarchive", "pin", "unpin", "delete"]),
});

export const userSearchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  searchBy: z.enum(["name", "username", "email", "phone"]).optional(),
  limit: z.number().min(1).max(50).optional(),
});

export type ChatFilterForm = z.infer<typeof chatFilterSchema>;
export type MessageFilterForm = z.infer<typeof messageFilterSchema>;
export type SendMessageForm = z.infer<typeof sendMessageSchema>;
export type UpdateMessageForm = z.infer<typeof updateMessageSchema>;
export type MarkMessagesAsWatchedForm = z.infer<
  typeof markMessagesAsWatchedSchema
>;
export type ChatSearchForm = z.infer<typeof chatSearchSchema>;
export type MessageSearchForm = z.infer<typeof messageSearchSchema>;
export type ChatActionForm = z.infer<typeof chatActionSchema>;
export type BulkChatActionForm = z.infer<typeof bulkChatActionSchema>;
export type UserSearchForm = z.infer<typeof userSearchSchema>;
