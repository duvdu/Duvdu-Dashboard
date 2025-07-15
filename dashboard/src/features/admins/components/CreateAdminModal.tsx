import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createUser } from "@/features/users/api/users.api";
import { useModal } from "@/store/modal-store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { type CreateAdminSchema } from "../schemas/admin.schema";
import { AdminForm } from "./admin-form";

export function CreateAdminModal() {
  const { isOpen, type, onClose, refetch } = useModal();
  const isModalOpen = isOpen && type === "createAdmin";

  const { mutateAsync: createUserMutation, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("Admin created successfully");
      if (refetch) refetch();
      onClose();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.errors?.[0]?.message || "Failed to create admin"
      );
    },
  });

  async function handleSubmit(values: CreateAdminSchema) {
    await createUserMutation({
      ...values,
      phoneNumber: {
        number: values.phoneNumber,
      },
    });
  }

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Admin</DialogTitle>
          <DialogDescription>
            Create a new admin user for the system.
          </DialogDescription>
        </DialogHeader>
        <AdminForm
          onSubmit={handleSubmit}
          isLoading={isPending}
          submitLabel="Create"
        />
      </DialogContent>
    </Dialog>
  );
}
