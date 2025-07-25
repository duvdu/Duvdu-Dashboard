import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  addExpirationTime,
  deleteExpirationTime,
  updateExpirationTime,
} from "../api/setting.api";
import { settingSchema, type SettingsSchema } from "../schemas/setting.schema";

export type SettingsFormProps = {
  defaultValues?: Partial<SettingsSchema>;
  onSubmit: (values: SettingsSchema) => void;
  isLoading?: boolean;
  submitLabel?: string;
  settingsId?: string;
  expirationTimes?: { time: number; _id: string }[];
  disabled?: boolean;
};

export function SettingsForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Save",
  settingsId,
  expirationTimes = [],
  disabled,
}: SettingsFormProps) {
  const methods = useForm<SettingsSchema>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      expirationTime: [],
      contractSubscriptionPercentage: 0,
      default_profile: "",
      default_cover: "",
      ...defaultValues,
    },
    mode: "onChange",
  });
  const { handleSubmit, control, setValue } = methods;
  const queryClient = useQueryClient();
  const [editIdx, setEditIdx] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [addValue, setAddValue] = useState<string>("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const { mutateAsync: addExp, isPending: isAdding } = useMutation({
    mutationFn: (time: number) => addExpirationTime(settingsId!, time),
    onSuccess: () => {
      toast.success("Expiration time added");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      setAddValue("");
    },
    onError: (e: any) =>
      toast.error(
        e?.response?.data?.errors?.[0]?.message ||
          "Failed to add expiration time"
      ),
  });
  const { mutateAsync: updateExp, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, time }: { id: string; time: number }) =>
      updateExpirationTime(settingsId!, id, time),
    onSuccess: () => {
      toast.success("Expiration time updated");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      setEditIdx(null);
    },
    onError: (e: any) =>
      toast.error(
        e?.response?.data?.errors?.[0]?.message ||
          "Failed to update expiration time"
      ),
  });
  const { mutateAsync: deleteExp, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteExpirationTime(settingsId!, id),
    onSuccess: () => {
      toast.success("Expiration time deleted");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (e: any) =>
      toast.error(
        e?.response?.data?.errors?.[0]?.message ||
          "Failed to delete expiration time"
      ),
  });

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="contractSubscriptionPercentage"
          control={control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Contract Subscription Percentage</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  readOnly={disabled}
                  min={0}
                  className="w-full"
                  {...field}
                  onChange={(e) => {
                    setValue(
                      "contractSubscriptionPercentage",
                      parseInt(e.target.value)
                    );
                  }}
                  disabled={isLoading || disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Expiration Times</CardTitle>
            <CardDescription>
              Set contract expiration times (in hours). You can add, edit, or
              remove available options. These are used for contract deadlines.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expirationTimes.length === 0 && (
                <div className="text-muted-foreground">
                  No expiration times yet.
                </div>
              )}
              {expirationTimes.map((exp) => (
                <div
                  key={exp._id}
                  className={`flex gap-2 items-center rounded-md px-2 py-1 ${
                    editIdx === exp._id ? "bg-accent/30" : ""
                  }`}
                >
                  {editIdx === exp._id ? (
                    <>
                      <Input
                        type="number"
                        min={0}
                        readOnly={disabled}
                        value={editValue}
                        onChange={(e) => setEditValue(Number(e.target.value))}
                        disabled={isUpdating && loadingId === exp._id}
                        className="w-24"
                        autoFocus
                      />
                      <Button
                        type="button"
                        loading={isUpdating && loadingId === exp._id}
                        disabled={disabled}
                        onClick={async () => {
                          setLoadingId(exp._id);
                          await updateExp({ id: exp._id, time: editValue });
                          setLoadingId(null);
                        }}
                        aria-label="Save"
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={disabled}
                        onClick={() => setEditIdx(null)}
                        aria-label="Cancel"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <div className="flex w-full items-center justify-between">
                      <span className="w-24 font-medium">{exp.time} hours</span>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          disabled={disabled}
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditIdx(exp._id);
                            setEditValue(exp.time);
                          }}
                          aria-label="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          disabled={disabled}
                          size="icon"
                          variant="ghost"
                          loading={isDeleting && loadingId === exp._id}
                          onClick={async () => {
                            setLoadingId(exp._id);
                            await deleteExp(exp._id);
                            setLoadingId(null);
                          }}
                          aria-label="Delete"
                        >
                          <TrashIcon className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {settingsId && (
                <div className="flex gap-2 items-center mt-2">
                  <Input
                    type="number"
                    min={0}
                    value={addValue}
                    onChange={(e) => setAddValue(e.target.value)}
                    placeholder="Add new time"
                    className="w-24"
                    disabled={isAdding || disabled}
                  />
                  <Button
                    type="button"
                    disabled={disabled}
                    size="sm"
                    loading={isAdding}
                    onClick={async () => {
                      if (!addValue) return;
                      setLoadingId("add");
                      await addExp(Number(addValue));
                      setLoadingId(null);
                    }}
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <FormField
          name="default_profile"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Profile Image</FormLabel>
              <FormControl>
                <ImageUploader
                  label=""
                  value={field.value}
                  onChange={(file) => setValue("default_profile", file)}
                  disabled={isLoading || disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="default_cover"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Cover Image</FormLabel>
              <FormControl>
                <ImageUploader
                  label=""
                  value={field.value}
                  onChange={(file) => setValue("default_cover", file)}
                  disabled={isLoading || disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            loading={isLoading}
            size="lg"
            className="w-fit"
            disabled={disabled}
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
