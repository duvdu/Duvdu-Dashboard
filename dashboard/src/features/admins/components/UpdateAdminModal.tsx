import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader } from "@/components/ui/loader";
import { getUserById, updateUser } from "@/features/users/api/users.api";
import { useModal } from "@/store/modal-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { type UpdateAdminSchema } from "../schemas/admin.schema";
import { AdminForm } from "./admin-form";

export function UpdateAdminModal() {
  const { isOpen, type, onClose, refetch, data } = useModal();
  const isModalOpen = isOpen && type === "updateAdmin";
  const adminId = data?.id;

  const {
    data: user,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["admin", adminId],
    queryFn: () => getUserById(adminId),
    enabled: !!adminId && isModalOpen,
  });

  const { mutateAsync: updateUserMutation, isPending } = useMutation({
    mutationFn: (values: UpdateAdminSchema) => {
      const formData = new FormData();

      // Append basic fields
      formData.append("name", values.name);
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("role", values.role);

      // Append phone number
      if (values.phoneNumber) {
        formData.append("phoneNumber[number]", values.phoneNumber);
      }

      return updateUser(adminId, formData);
    },
    onSuccess: () => {
      toast.success("Admin updated successfully");
      if (refetch) refetch();
      onClose();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.errors?.[0]?.message || "Failed to update admin"
      );
    },
  });

  async function handleSubmit(values: UpdateAdminSchema) {
    await updateUserMutation(values);
  }

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Admin</DialogTitle>
          <DialogDescription>
            Update the admin user information.
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
          <AdminForm
            defaultValues={{
              name: user?.name || "",
              username: user?.username || "",
              phoneNumber: user?.phoneNumber?.number || "",
              // profileImage: user?.profileImage || undefined,
              // coverImage: user?.coverImage || undefined,
              role: user?.role || "",
              // password: "",
              email: user?.email || "",
            }}
            onSubmit={handleSubmit}
            isLoading={isPending}
            submitLabel="Update"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
