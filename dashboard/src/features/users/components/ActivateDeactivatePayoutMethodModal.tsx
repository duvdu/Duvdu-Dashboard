import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updatePayoutMethodStatus } from "@/features/payout-methods/api/payout-methods.api";
import { useModal } from "@/store/modal-store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function ActivateDeactivatePayoutMethodModal() {
  const { data, isOpen, type, onClose, refetch } = useModal();
  const isModalOpen = isOpen && type === "activateDeactivatePayoutMethod";

  const payoutMethodId = data?.payoutMethodId;
  const isActive = data?.status === "active";

  const { mutate: updateStatus, isPending } = useMutation({
    mutationKey: ["withdraw-methods", "activateDeactivate"],
    mutationFn: async () => {
      if (!payoutMethodId) throw new Error("No payout method ID");
      const newStatus = isActive ? "inactive" : "active";
      await updatePayoutMethodStatus(payoutMethodId, newStatus);
    },
    onSuccess: () => {
      toast.success(
        isActive ? "Payout method deactivated" : "Payout method activated"
      );
      if (refetch) refetch();
      onClose();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.errors?.[0]?.message ||
          "Failed to update payout method status"
      );
    },
  });

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="min-w-[30vw] gap-8 rounded-3xl text-center">
        <DialogHeader>
          <DialogTitle>
            {isActive ? "Deactivate Payout Method" : "Activate Payout Method"}
          </DialogTitle>
          <DialogDescription>
            {isActive
              ? "Are you sure you want to deactivate this payout method?"
              : "Are you sure you want to activate this payout method?"}
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
            className="font-semibold text-lg"
            disabled={isPending}
            onClick={() => updateStatus()}
          >
            {isPending
              ? isActive
                ? "Deactivating..."
                : "Activating..."
              : isActive
              ? "Deactivate"
              : "Activate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
