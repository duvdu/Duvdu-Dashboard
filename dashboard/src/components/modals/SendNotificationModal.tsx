import { sendNotification } from "@/features/notifications/api/notification.api";
import { useModal } from "@/store/modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

// Schema for form validation
const sendNotificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
});

type SendNotificationForm = z.infer<typeof sendNotificationSchema>;

export function SendNotificationModal() {
  const { data, isOpen, type, onClose, refetch } = useModal();
  const isModalOpen = isOpen && type === "sendNotification";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SendNotificationForm>({
    resolver: zodResolver(sendNotificationSchema),
    defaultValues: {
      title: data?.title || "",
      message: data?.message || "",
    },
  });

  const handleSubmit = async (values: SendNotificationForm) => {
    setLoading(true);
    setError(null);
    try {
      await sendNotification({ users: data?.users || [], ...values });
      toast.success("Notification sent successfully");
      if (refetch) refetch();
      onClose();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to send notification");
      if (typeof e === "object" && e && "message" in e) {
        setError(
          (e as { message?: string }).message || "Failed to send notification"
        );
      } else {
        setError("Failed to send notification");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="min-w-[30vw] gap-8 rounded-3xl text-center">
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
          <DialogDescription>
            Send a notification to selected users.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <Input
            placeholder="Title"
            {...form.register("title")}
            disabled={loading}
          />
          {form.formState.errors.title && (
            <span className="text-red-500 text-xs text-start">
              {form.formState.errors.title.message}
            </span>
          )}
          <Textarea
            placeholder="Message"
            {...form.register("message")}
            disabled={loading}
          />
          {form.formState.errors.message && (
            <span className="text-red-500 text-xs text-start">
              {form.formState.errors.message.message}
            </span>
          )}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogFooter className="flex  gap-2 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className=" font-semibold text-lg"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Notification"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
