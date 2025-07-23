import { z } from "zod";

export const fundTransactionSchema = z.object({
  fundAmount: z.number().min(1, "Amount is required"),
  withdrawMethod: z.string().min(1, "Withdraw method is required"),
  fundAttachment: z.any().refine((file) => !!file, {
    message: "Attachment is required",
  }),
  user: z.string().optional(),
});

export type FundTransactionSchema = z.infer<typeof fundTransactionSchema>;
