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
import { type UpdateUserSchema } from "../schemas/user.schema";
import { UserForm } from "./user-form";

export function UpdateUserModal() {
  const { isOpen, type, onClose, refetch, data } = useModal();
  const isModalOpen = isOpen && type === "updateUser";
  const userId = data?.id;

  const {
    data: user,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId && isModalOpen,
  });

  const { mutateAsync: updateUserMutation, isPending } = useMutation({
    mutationFn: (values: UpdateUserSchema) => {
      const formData = new FormData();

      // Append basic fields
      formData.append("name", values.name);
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append(
        "avaliableContracts",
        values.availableContracts.toString()
      );

      // Append phone number
      if (values.phoneNumber) {
        formData.append("phoneNumber[number]", values.phoneNumber);
      }

      // Append images
      if (values.profileImage instanceof File) {
        formData.append("profileImage", values.profileImage);
      } else if (values.profileImage) {
        formData.append("profileImage", values.profileImage);
      }

      if (values.coverImage instanceof File) {
        formData.append("coverImage", values.coverImage);
      } else if (values.coverImage) {
        formData.append("coverImage", values.coverImage);
      }

      return updateUser(userId, formData);
    },
    onSuccess: () => {
      toast.success("User updated successfully");
      if (refetch) refetch();
      onClose();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.errors?.[0]?.message || "Failed to update user"
      );
    },
  });

  async function handleSubmit(values: UpdateUserSchema) {
    await updateUserMutation(values);
  }

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
          <DialogDescription>Update the user information.</DialogDescription>
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
          <UserForm
            defaultValues={{
              name: user?.name || "",
              username: user?.username || "",
              phoneNumber: user?.phoneNumber?.number || "",
              email: user?.email || "",
              availableContracts: user?.avaliableContracts || 0,
              profileImage: user?.profileImage || null,
              coverImage: user?.coverImage || null,
            }}
            onSubmit={handleSubmit}
            isLoading={isPending}
            submitLabel="Update"
            onCancel={() => onClose()}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
