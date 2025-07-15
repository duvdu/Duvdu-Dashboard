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
import { pauseProject } from "../api/project.api";

const pauseProjectSchema = z.object({
  reason: z.string().optional(),
});

type PauseProjectSchema = z.infer<typeof pauseProjectSchema>;

export function PauseProjectModal() {
  const { data, isOpen, type, onClose, refetch } = useModal();
  const isModalOpen = isOpen && type === "pauseProject";

  const form = useForm<PauseProjectSchema>({
    resolver: zodResolver(pauseProjectSchema),
    defaultValues: {
      reason: "",
    },
  });

  const { mutateAsync: pauseProjectMutation, isPending } = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      pauseProject(id, reason),
    onSuccess: () => {
      toast.success("Project paused successfully");
      if (refetch) refetch();
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.errors?.[0]?.message || "Failed to pause project"
      );
    },
  });

  const handlePause = async (values: PauseProjectSchema) => {
    if (!data?.id) return;
    await pauseProjectMutation({ id: data.id, reason: values.reason });
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
          <DialogTitle>Pause Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to pause this project? This will temporarily
            hide it from users.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handlePause)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a reason for pausing..."
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
              <Button type="submit" variant="secondary" disabled={isPending}>
                {isPending ? "Pausing..." : "Pause Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
