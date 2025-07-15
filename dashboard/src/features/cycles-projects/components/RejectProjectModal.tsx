import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { rejectProject } from "../api/project.api";

const rejectProjectSchema = z.object({
  reason: z.string().optional(),
});

type RejectProjectSchema = z.infer<typeof rejectProjectSchema>;

export function RejectProjectModal() {
  const { data, isOpen, type, onClose, refetch } = useModal();
  const isModalOpen = isOpen && type === "rejectProject";

  const form = useForm<RejectProjectSchema>({
    resolver: zodResolver(rejectProjectSchema),
    defaultValues: {
      reason: "",
    },
  });

  const { mutateAsync: rejectProjectMutation, isPending } = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      rejectProject(id, reason),
    onSuccess: () => {
      toast.success("Project rejected successfully");
      if (refetch) refetch();
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.errors?.[0]?.message ||
          "Failed to reject project"
      );
    },
  });

  const handleReject = async (values: RejectProjectSchema) => {
    if (!data?.id) return;
    await rejectProjectMutation({ id: data.id, reason: values.reason });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to reject this project? This will hide it from
            users and notify the creator.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleReject)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a reason for rejection..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={isPending}>
                {isPending ? "Rejecting..." : "Reject Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
