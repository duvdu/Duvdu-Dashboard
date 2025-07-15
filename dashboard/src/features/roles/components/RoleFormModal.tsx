import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModal } from "@/store/modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createRole, updateRole } from "../api/roles.api";
import { PERMISSIONS } from "../constants/permissions";
import type { RoleSchema } from "../schemas/role.schema";
import { roleSchema } from "../schemas/role.schema";

export function RoleFormModal() {
  const queryClient = useQueryClient();
  const { type, data, isOpen, onClose, refetch } = useModal();
  const isCreate = type === "createRole";
  const isUpdate = type === "updateRole";
  const isModalOpen = isOpen && (isCreate || isUpdate);

  const mutation = useMutation({
    mutationFn: async (values: RoleSchema) => {
      if (isCreate) return createRole(values);
      if (isUpdate && data?._id) return updateRole(data._id, values);
    },
    onSuccess: () => {
      toast.success(
        isCreate ? "Role created successfully" : "Role updated successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      if (refetch) refetch();
      onClose();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.errors?.[0]?.message || "Failed to save role"
      );
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<RoleSchema>({
    resolver: zodResolver(roleSchema),
    defaultValues: { key: "", permissions: [] },
  });

  React.useEffect(() => {
    if (isModalOpen) {
      reset({
        key: data?.key || "",
        permissions: data?.permissions || [],
      });
    }
  }, [isModalOpen, data, reset]);

  const selectedPermissions = watch("permissions");

  const handlePermissionChange = (perm: string, checked: boolean) => {
    const newPerms = checked
      ? [...selectedPermissions, perm]
      : selectedPermissions.filter((p) => p !== perm);
    setValue("permissions", newPerms, { shouldValidate: true });
  };

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdate ? "Edit Role" : "Create Role"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          className="space-y-6"
        >
          <div>
            <Label htmlFor="role-key">Role Key</Label>
            <Input
              id="role-key"
              type="text"
              className="w-full border rounded-md p-2 mt-1"
              placeholder="Ex. Moderator"
              {...register("key")}
              disabled={mutation.isPending || isUpdate}
            />
            {errors.key && (
              <div className="text-red-500 text-xs mt-1">
                {errors.key.message}
              </div>
            )}
          </div>
          <div>
            <div className="font-medium text-slate-600 mb-2">Permissions</div>
            <div className="max-h-72 w-full overflow-y-auto border rounded-md p-3">
              {Object.entries(PERMISSIONS).map(([group, perms]) => (
                <div className="mb-3" key={group}>
                  <div className="font-medium text-slate-600 mb-1">{group}</div>
                  <div className="pl-4">
                    {perms.map((perm) => (
                      <div className="mb-1" key={perm}>
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedPermissions.includes(perm)}
                            onCheckedChange={(checked) =>
                              handlePermissionChange(perm, !!checked)
                            }
                            disabled={mutation.isPending}
                          />
                          {perm}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {errors.permissions && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.permissions.message}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              {isUpdate ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RoleFormModal;
