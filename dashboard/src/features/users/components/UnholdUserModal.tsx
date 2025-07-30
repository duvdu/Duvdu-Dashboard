import { deleteUser } from "@/features/users/api/users.api";
import { useModal } from "@/store/modal-store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

export function UnholdUserModal() {
  const { data, isOpen, type, onClose, refetch } = useModal();
  const isModalOpen = isOpen && type === "unholdUser";

  const { mutateAsync: unholdUserMutation, isPending } = useMutation({
    mutationFn: deleteUser,
    mutationKey: ["users", "admins", "unhold"],
    onSuccess: () => {
      toast.success("User unheld successfully");
      if (refetch) refetch();
      onClose();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.errors?.[0]?.message || "Failed to unhold user"
      );
    },
  });

  const handleUnhold = async () => {
    if (!data?.id) return;
    await unholdUserMutation(data.id);
  };

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="min-w-[24vw] gap-8 rounded-3xl text-center">
        <DialogHeader>
          <DialogTitle>Unhold User</DialogTitle>
          <DialogDescription>
            Are you sure you want to unhold this user? This action will allow
            them to create projects again.
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
            variant="default"
            onClick={handleUnhold}
            loading={isPending}
          >
            Unhold
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
