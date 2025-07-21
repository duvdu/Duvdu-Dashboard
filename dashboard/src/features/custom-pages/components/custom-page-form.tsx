import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  customPageSchema,
  type CustomPageSchema,
} from "../schemas/custom-page.schema";

export type CustomPageFormProps = {
  defaultValues?: Partial<CustomPageSchema>;
  onSubmit: (values: CustomPageSchema) => void;
  isLoading?: boolean;
  submitLabel?: string;
};

export function CustomPageForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Save",
}: CustomPageFormProps) {
  const methods = useForm<CustomPageSchema>({
    resolver: zodResolver(customPageSchema),
    defaultValues,
  });
  const { handleSubmit, control, formState } = methods;
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block mb-1">Title</label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input placeholder="Page title" {...field} disabled={isLoading} />
          )}
        />
        {formState.errors.title && (
          <div className="text-red-500 text-xs mt-1">
            {formState.errors.title.message}
          </div>
        )}
      </div>
      <div>
        <label className="block mb-1">Content</label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <SimpleEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {formState.errors.content && (
          <div className="text-red-500 text-xs mt-1">
            {formState.errors.content.message}
          </div>
        )}
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
