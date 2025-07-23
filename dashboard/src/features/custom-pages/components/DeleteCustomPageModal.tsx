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
import { deleteCustomPage } from "../api/custom-page.api";

export function DeleteCustomPageModal() {
  const { data, isOpen, type, onClose, refetch } = useModal();
  const isModalOpen = isOpen && type === "deleteCustomPage";

  const { mutateAsync: deleteCustomPageMutation, isPending } = useMutation({
    mutationFn: deleteCustomPage,
    onSuccess: () => {
      toast.success("Custom page deleted successfully");
      if (refetch) refetch();
      onClose();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.errors?.[0]?.message ||
          "Failed to delete custom page"
      );
    },
  });

  const handleDelete = async () => {
    if (!data?.id) return;
    await deleteCustomPageMutation(data.id);
  };

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="min-w-[24vw] gap-8 rounded-3xl text-center">
        <DialogHeader>
          <DialogTitle>Delete Custom Page</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the custom page{" "}
            <b>{data?.title?.en || data?.name}</b>? This action cannot be
            undone.
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

export default DeleteCustomPageModal;
