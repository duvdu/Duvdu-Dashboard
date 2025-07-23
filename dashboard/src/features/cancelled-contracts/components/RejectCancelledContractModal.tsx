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
import { rejectCancelledContract } from "../api/cancelled-contract.api";

export function RejectCancelledContractModal() {
  const { data, isOpen, type, onClose, refetch } = useModal();
  const isModalOpen = isOpen && type === "rejectCancelledContract";

  const { mutateAsync: rejectMutation, isPending } = useMutation({
    mutationFn: rejectCancelledContract,
    onSuccess: () => {
      toast.success("Cancelled contract rejected successfully");
      if (refetch) refetch();
      onClose();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.errors?.[0]?.message ||
          "Failed to reject cancelled contract"
      );
    },
  });

  const handleReject = async () => {
    if (!data?.id) return;
    await rejectMutation(data.id);
  };

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="min-w-[24vw] gap-8 rounded-3xl text-center">
        <DialogHeader>
          <DialogTitle>Reject Cancelled Contract</DialogTitle>
          <DialogDescription>
            Are you sure you want to reject this cancelled contract? This action
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
            onClick={handleReject}
            loading={isPending}
          >
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RejectCancelledContractModal;
