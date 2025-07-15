import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader } from "@/components/ui/loader";
import { useModal } from "@/store/modal-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getRole, updateRole } from "../api/roles.api";
import type { RoleSchema } from "../schemas/role.schema";
import { RoleForm } from "./role-form";

export function UpdateRoleModal() {
  const queryClient = useQueryClient();
  const { isOpen, type, onClose, refetch, data } = useModal();
  const isModalOpen = isOpen && type === "updateRole";
  const roleId = data?._id;

  const {
    data: role,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["role", roleId],
    queryFn: () => getRole(roleId),
    enabled: !!roleId && isModalOpen,
  });

  const { mutateAsync: updateRoleMutation, isPending } = useMutation({
    mutationFn: (values: RoleSchema) => updateRole(roleId, values),
    onSuccess: () => {
      toast.success("Role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      if (refetch) refetch();
      onClose();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.errors?.[0]?.message || "Failed to update role"
      );
    },
  });

  async function handleSubmit(values: RoleSchema) {
    await updateRoleMutation(values);
  }

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Role</DialogTitle>
          <DialogDescription>
            Update the role and its permissions.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader className="w-8 h-8" />
          </div>
        ) : (
          <RoleForm
            defaultValues={{
              key: role?.key || "",
              permissions: role?.permissions || [],
            }}
            onSubmit={handleSubmit}
            isLoading={isPending}
            submitLabel="Update"
            disableKeyEdit={true}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
