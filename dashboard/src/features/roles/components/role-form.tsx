import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getGroupedPermissionsForForm } from "../constants/permissions";
import type { RoleSchema } from "../schemas/role.schema";
import { roleSchema } from "../schemas/role.schema";

export type RoleFormProps = {
  defaultValues?: Partial<RoleSchema>;
  onSubmit: (values: RoleSchema) => void;
  isLoading?: boolean;
  submitLabel?: string;
  disableKeyEdit?: boolean;
};

export function RoleForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Save",
  disableKeyEdit = false,
}: RoleFormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );

  const methods = useForm<RoleSchema>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      key: "",
      permissions: [],
      ...defaultValues,
    },
    mode: "onChange",
  });

  const { handleSubmit, control, setValue, watch } = methods;
  const selectedPermissions = watch("permissions");

  const handlePermissionChange = (perm: string, checked: boolean) => {
    const newPerms = checked
      ? [...selectedPermissions, perm]
      : selectedPermissions.filter((p) => p !== perm);
    setValue("permissions", newPerms, { shouldValidate: true });
  };

  const handleGroupToggle = (group: string, perms: string[]) => {
    const groupPerms = perms.filter(
      (perm) =>
        !searchTerm || perm.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const allSelected = groupPerms.every((perm) =>
      selectedPermissions.includes(perm)
    );

    if (allSelected) {
      // Deselect all permissions in this group
      const newPerms = selectedPermissions.filter(
        (perm) => !groupPerms.includes(perm)
      );
      setValue("permissions", newPerms, { shouldValidate: true });
    } else {
      // Select all permissions in this group
      const newPerms = [...new Set([...selectedPermissions, ...groupPerms])];
      setValue("permissions", newPerms, { shouldValidate: true });
    }
  };

  const handleSelectAll = () => {
    const allPermissions = Object.values(getGroupedPermissionsForForm())
      .flat()
      .filter(
        (perm) =>
          !searchTerm || perm.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setValue("permissions", allPermissions, { shouldValidate: true });
  };

  const handleClearAll = () => {
    if (searchTerm) {
      // Clear only filtered permissions
      const filteredPerms = Object.values(getGroupedPermissionsForForm())
        .flat()
        .filter((perm) =>
          perm.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const newPerms = selectedPermissions.filter(
        (perm) => !filteredPerms.includes(perm)
      );
      setValue("permissions", newPerms, { shouldValidate: true });
    } else {
      // Clear all permissions
      setValue("permissions", [], { shouldValidate: true });
    }
  };

  const toggleGroupExpansion = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const groupedPermissions = getGroupedPermissionsForForm();

  const filteredPermissions = Object.entries(groupedPermissions).reduce(
    (acc, [group, perms]) => {
      const filteredPerms = perms.filter(
        (perm) =>
          !searchTerm || perm.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredPerms.length > 0) {
        acc[group] = filteredPerms;
      }
      return acc;
    },
    {} as Record<string, string[]>
  );

  const totalPermissions = Object.values(filteredPermissions).flat().length;
  const selectedCount = selectedPermissions.filter((perm) =>
    Object.values(filteredPermissions).flat().includes(perm)
  ).length;

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="key"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Key</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex. Moderator"
                  disabled={isLoading || disableKeyEdit}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="permissions"
          control={control}
          render={() => (
            <FormItem>
              <FormLabel>Permissions</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {/* Search and Actions */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search permissions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {selectedCount} of {totalPermissions} permissions
                        selected
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleSelectAll}
                          disabled={
                            isLoading || selectedCount === totalPermissions
                          }
                        >
                          Select All
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleClearAll}
                          disabled={isLoading || selectedCount === 0}
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Permissions List */}
                  <div className="max-h-96 overflow-y-auto border rounded-md">
                    {Object.entries(filteredPermissions).map(
                      ([group, perms]) => {
                        const isExpanded = expandedGroups[group] !== false; // Default to expanded
                        const groupSelectedCount = perms.filter((perm) =>
                          selectedPermissions.includes(perm)
                        ).length;
                        const allGroupSelected =
                          groupSelectedCount === perms.length;
                        const partialGroupSelected =
                          groupSelectedCount > 0 && !allGroupSelected;

                        return (
                          <Collapsible
                            key={group}
                            open={isExpanded}
                            onOpenChange={() => toggleGroupExpansion(group)}
                          >
                            <div className="border-b last:border-b-0">
                              <CollapsibleTrigger className="w-full p-3 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    {isExpanded ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                    <Checkbox
                                      checked={allGroupSelected}
                                      ref={(el: HTMLButtonElement | null) => {
                                        if (el) {
                                          const checkbox = el.querySelector(
                                            'input[type="checkbox"]'
                                          ) as HTMLInputElement;
                                          if (checkbox) {
                                            checkbox.indeterminate =
                                              partialGroupSelected;
                                          }
                                        }
                                      }}
                                      onCheckedChange={() =>
                                        handleGroupToggle(group, perms)
                                      }
                                      disabled={isLoading}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <span className="font-medium text-sm">
                                      {group}
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {groupSelectedCount}/{perms.length}
                                  </div>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="pl-10 pr-3 pb-3 space-y-2">
                                  {perms.map((perm) => (
                                    <div
                                      key={perm}
                                      className="flex items-center gap-2"
                                    >
                                      <Checkbox
                                        checked={selectedPermissions.includes(
                                          perm
                                        )}
                                        onCheckedChange={(checked) =>
                                          handlePermissionChange(
                                            perm,
                                            !!checked
                                          )
                                        }
                                        disabled={isLoading}
                                      />
                                      <label className="text-sm cursor-pointer flex-1">
                                        {perm}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        );
                      }
                    )}
                  </div>

                  {Object.keys(filteredPermissions).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No permissions found matching "{searchTerm}"
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" loading={isLoading} className="w-full">
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
}
