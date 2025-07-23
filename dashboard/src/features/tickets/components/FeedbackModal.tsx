import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/store/modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { patchTicketFeedback } from "../api/ticket.api";

const feedbackSchema = z.object({
  feedback: z.string().min(1, "Feedback is required"),
});

type FeedbackSchema = z.infer<typeof feedbackSchema>;

export function FeedbackModal() {
  const { isOpen, type, onClose, data, refetch } = useModal();
  const isModalOpen = isOpen && type === "addTicketFeedback";
  console.log("data", data);
  const ticketId = data?.id;

  const form = useForm<FeedbackSchema>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { feedback: "" },
  });

  const { handleSubmit, reset, control } = form;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: FeedbackSchema) => {
      return patchTicketFeedback(ticketId, values.feedback);
    },
    onSuccess: () => {
      toast.success("Feedback sent and ticket closed");
      if (refetch) refetch();
      onClose();
      reset();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.errors?.[0]?.message || "Failed to send feedback"
      );
    },
  });

  async function onSubmit(values: FeedbackSchema) {
    await mutateAsync(values);
  }

  if (!isModalOpen) return null;

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          reset();
        }
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Add feedback to this ticket. Submitting will close the ticket.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter feedback..."
                      className="w-full min-h-[80px] max-h-[200px]"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button type="submit" loading={isPending}>
                Send Feedback
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
