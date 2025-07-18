import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { PERMISSION_KEYS } from "@/config/permissions";
import { useModal } from "@/store/modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  addComplaintFeedback,
  closeComplaintWithFeedback,
} from "../api/complaint.api";
import {
  feedbackSchema,
  type FeedbackSchema,
} from "../schemas/complaint.schema";

export function FeedbackModal() {
  const { isOpen, type, onClose, data, refetch } = useModal();
  const isModalOpen = isOpen && type === "addComplaintFeedback";
  const complaintId = data?.id;
  const navigate = useNavigate();

  const form = useForm<FeedbackSchema>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      feedback: "",
      sendNotification: false,
      closeComplaint: false,
    },
  });

  const { handleSubmit, reset, control } = form;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: FeedbackSchema) => {
      if (values.closeComplaint) {
        return closeComplaintWithFeedback(
          complaintId,
          values.feedback,
          values.sendNotification
        );
      } else {
        return addComplaintFeedback(
          complaintId,
          values.feedback,
          values.sendNotification
        );
      }
    },
    onSuccess: (_, values) => {
      toast.success(
        values.closeComplaint ? "Complaint closed" : "Feedback sent"
      );
      if (values.closeComplaint) {
        navigate(`/dashboard/complaints`);
      }
      if (refetch) refetch();
      onClose();
      reset();
    },
    onError: (error) => {
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
            Add feedback to this complaint. Optionally, close the complaint.
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
            <ProtectedComponent
              permissionKeys={[PERMISSION_KEYS.COMPLAINTS.CLOSE]}
            >
              <FormField
                control={control}
                name="closeComplaint"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
                        />
                        Close this complaint
                      </label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ProtectedComponent>
            <FormField
              control={control}
              name="sendNotification"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                      Send notification
                    </label>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={isPending}>
                {form.getValues("closeComplaint")
                  ? "Close Complaint"
                  : "Send Feedback"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
