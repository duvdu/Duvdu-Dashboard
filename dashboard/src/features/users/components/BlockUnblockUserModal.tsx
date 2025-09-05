import {
  blockAdmin,
  blockUser,
  unblockAdmin,
  unblockUser,
} from "@/features/users/api/users.api";
import {
  userBlockSchema,
  userUnblockSchema,
} from "@/features/users/schemas/user.schema";
import { useModal } from "@/store/modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Textarea } from "../../../components/ui/textarea";

export function BlockUnblockUserModal() {
  const { data, isOpen, type, onClose, refetch } = useModal();
  const isModalOpen = isOpen && type === "blockUnblockUser";

  const isCurrentlyBlocked = data?.isBlocked;
  const userId = data?.userId;
  const isAdmin = data?.isAdmin;

  // Use different schemas based on block status
  const schema = isCurrentlyBlocked ? userUnblockSchema : userBlockSchema;
  type FormType = z.infer<typeof schema>;

  const { mutate: performBlockUnblock, isPending: isProcessing } = useMutation({
    mutationKey: ["users", "blockUnblock"],
    mutationFn: ({ userId, reason }: { userId: string; reason?: string }) => {
      if (isCurrentlyBlocked) {
        return isAdmin
          ? unblockAdmin(userId, reason)
          : unblockUser(userId, reason);
      }
      return isAdmin ? blockAdmin(userId, reason!) : blockUser(userId, reason!);
    },
    onSuccess: () => {
      toast.success(
        isCurrentlyBlocked
          ? "User unblocked successfully"
          : "User blocked successfully"
      );
      if (refetch) refetch();
      onClose();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.errors?.[0]?.message ||
          "Failed to update user status"
      );
    },
  });

  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      reason: data?.reason || "",
    },
  });

  const handleSubmit = async (values: FormType) => {
    if (!userId) return;
    performBlockUnblock({ userId, reason: values.reason });
  };

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="min-w-[30vw] gap-8 rounded-3xl text-center">
        <DialogHeader>
          <DialogTitle>
            {isCurrentlyBlocked ? "Unblock User" : "Block User"}
          </DialogTitle>
          <DialogDescription>
            {isCurrentlyBlocked
              ? "Are you sure you want to unblock this user?"
              : "Provide a reason for blocking this user."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Only show reason field when blocking */}
          {!isCurrentlyBlocked && (
            <>
              <Textarea
                placeholder="Reason"
                {...form.register("reason")}
                disabled={isProcessing}
              />
              {form.formState.errors.reason && (
                <span className="text-red-500 text-xs text-start">
                  {form.formState.errors.reason.message}
                </span>
              )}
            </>
          )}
          <DialogFooter className="flex gap-2 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="font-semibold text-lg"
              disabled={isProcessing}
            >
              {isProcessing
                ? isCurrentlyBlocked
                  ? "Unblocking..."
                  : "Blocking..."
                : isCurrentlyBlocked
                ? "Unblock User"
                : "Block User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
