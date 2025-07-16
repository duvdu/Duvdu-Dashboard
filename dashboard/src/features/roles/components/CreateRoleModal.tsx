import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/store/modal-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createRole } from "../api/roles.api";
import type { RoleSchema } from "../schemas/role.schema";
import { RoleForm } from "./role-form";

export function CreateRoleModal() {
  const queryClient = useQueryClient();
  const { isOpen, type, onClose, refetch } = useModal();
  const isModalOpen = isOpen && type === "createRole";

  const { mutateAsync: createRoleMutation, isPending } = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      toast.success("Role created successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      if (refetch) refetch();
      onClose();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.errors?.[0]?.message || "Failed to create role"
      );
    },
  });

  async function handleSubmit(values: RoleSchema) {
    await createRoleMutation(values);
  }

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] ">
        <DialogHeader>
          <DialogTitle>Create Role</DialogTitle>
          <DialogDescription>
            Create a new role with specific permissions.
          </DialogDescription>
        </DialogHeader>
        <RoleForm
          onSubmit={handleSubmit}
          isLoading={isPending}
          submitLabel="Create"
        />
      </DialogContent>
    </Dialog>
  );
}
