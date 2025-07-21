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
import { deleteContractReview } from "../api/contract-review.api";

export function DeleteContractReviewModal() {
  const { data, isOpen, type, onClose, refetch } = useModal();
  const isModalOpen = isOpen && type === "deleteContractReview";
  const { mutateAsync: deleteContractReviewMutation, isPending } = useMutation({
    mutationFn: deleteContractReview,
    mutationKey: ["contract-reviews", data?.id],
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
    await deleteContractReviewMutation(data.id);
  };
  if (!isModalOpen) return null;
  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="min-w-[24vw] gap-8 rounded-3xl text-center">
        <DialogHeader>
          <DialogTitle>Delete Contract Review</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this contract review? This action
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
