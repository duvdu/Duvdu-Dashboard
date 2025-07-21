import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/store/modal-store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteProjectReport } from "../api/project-report.api";

export function DeleteProjectReportModal() {
  const { data, isOpen, type, onClose, refetch } = useModal();
  const isModalOpen = isOpen && type === "deleteProjectReport";
  const { mutateAsync: deleteProjectReportMutation, isPending } = useMutation({
    mutationFn: deleteProjectReport,
    mutationKey: ["project-reports", data?.id],
    onSuccess: () => {
      if (refetch) refetch();
      onClose();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.errors?.[0]?.message || "Something went wrong"
      );
    },
  });
  const handleDelete = async () => {
    if (!data?.id) return;
    await deleteProjectReportMutation(data.id);
  };
  if (!isModalOpen) return null;
  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="min-w-[24vw] gap-8 rounded-3xl text-center">
        <DialogHeader>
          <DialogTitle>Delete Project Report</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this project report? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            loading={isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
