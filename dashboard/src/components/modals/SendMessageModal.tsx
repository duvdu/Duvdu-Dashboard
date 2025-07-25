import { sendMessage } from "@/features/messages/api/message.api";
import {
  type SendMessageForm,
  sendMessageSchema,
} from "@/features/messages/schemas/message.schema";
import { useModal } from "@/store/modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";

export function SendMessageModal() {
  const { data, isOpen, type, onClose, refetch } = useModal();
  const isModalOpen = isOpen && type === "sendMessage";
  const { mutateAsync: sendMessageMutation, isPending: loading } = useMutation({
    mutationFn: sendMessage,
    mutationKey: ["sendMessage"],
    onSuccess: () => {
      toast.success("Message sent successfully");
      if (refetch) refetch();
      onClose();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.errors?.[0]?.message || "Failed to send message"
      );
    },
  });

  const form = useForm<SendMessageForm>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      content: data?.content || "",
      receiver: data?.receiver || "",
    },
  });

  const handleSubmit = async (values: SendMessageForm) => {
    sendMessageMutation({
      content: values.content,
      receiver: values.receiver || data?.receiver,
    });
  };

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="min-w-[30vw] gap-8 rounded-3xl text-center">
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
          <DialogDescription>
            Send a chat message to the selected user.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
          encType="multipart/form-data"
        >
          {/* Hidden receiver input if passed via modal data */}
          <input
            type="hidden"
            {...form.register("receiver")}
            value={data?.receiver || ""}
          />
          <Textarea
            placeholder="Message content"
            {...form.register("content")}
            disabled={loading}
          />
          {form.formState.errors.content && (
            <span className="text-red-500 text-xs text-start">
              {form.formState.errors.content.message}
            </span>
          )}

          <DialogFooter className="flex gap-2 justify-center">
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
              className="font-semibold text-lg"
              loading={loading}
            >
              Send Message
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
