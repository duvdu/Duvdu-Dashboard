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
import { approveCancelledContract } from "../api/cancelled-contract.api";

export function ApproveCancelledContractModal() {
  const { data, isOpen, type, onClose, refetch } = useModal();
  const isModalOpen = isOpen && type === "approveCancelledContract";

  const { mutateAsync: approveMutation, isPending } = useMutation({
    mutationFn: approveCancelledContract,
    onSuccess: () => {
      toast.success("Cancelled contract approved successfully");
      if (refetch) refetch();
      onClose();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.errors?.[0]?.message ||
          "Failed to approve cancelled contract"
      );
    },
  });

  console.log(data, "data");
  const handleApprove = async () => {
    if (!data?.id) return;
    await approveMutation(data.id);
  };

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="min-w-[24vw] gap-8 rounded-3xl text-center">
        <DialogHeader>
          <DialogTitle>Approve Cancelled Contract</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve this cancelled contract? This
            action cannot be undone.
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
          <Button type="button" onClick={handleApprove} loading={isPending}>
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ApproveCancelledContractModal;
