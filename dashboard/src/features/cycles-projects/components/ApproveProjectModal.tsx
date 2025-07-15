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
import { approveProject } from "../api/project.api";

const approveProjectSchema = z.object({
  reason: z.string().optional(),
});

type ApproveProjectSchema = z.infer<typeof approveProjectSchema>;

export function ApproveProjectModal() {
  const { data, isOpen, type, onClose, refetch } = useModal();
  const isModalOpen = isOpen && type === "approveProject";

  const form = useForm<ApproveProjectSchema>({
    resolver: zodResolver(approveProjectSchema),
    defaultValues: {
      reason: "",
    },
  });

  const { mutateAsync: approveProjectMutation, isPending } = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      approveProject(id, reason),
    onSuccess: () => {
      toast.success("Project approved successfully");
      if (refetch) refetch();
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.errors?.[0]?.message ||
          "Failed to approve project"
      );
    },
  });

  const handleApprove = async (values: ApproveProjectSchema) => {
    if (!data?.id) return;
    await approveProjectMutation({ id: data.id, reason: values.reason });
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
          <DialogTitle>Approve Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve this project? This will make it
            visible to users.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleApprove)}
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
                      placeholder="Enter a reason for approval..."
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
              <Button
                type="submit"
                disabled={isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {isPending ? "Approving..." : "Approve Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
