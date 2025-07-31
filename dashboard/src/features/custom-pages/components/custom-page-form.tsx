import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  customPageSchema,
  type CustomPageSchema,
} from "../schemas/custom-page.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const navigate = useNavigate();
  const { handleSubmit, control, formState } = methods;
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block mb-1">Title (English)</label>
        <Controller
          name="titleEn"
          control={control}
          render={({ field }) => (
            <Input placeholder="Page title" {...field} disabled={isLoading} />
          )}
        />
        {formState.errors.titleEn && (
          <div className="text-red-500 text-xs mt-1">
            {formState.errors.titleEn.message}
          </div>
        )}
      </div>
      <div>
        <label className="block mb-1">Title (Arabic)</label>
        <Controller
          name="titleAr"
          control={control}
          render={({ field }) => (
            <Input placeholder="Page title" {...field} disabled={isLoading} />
          )}
        />
        {formState.errors.titleAr && (
          <div className="text-red-500 text-xs mt-1">
            {formState.errors.titleAr.message}
          </div>
        )}
      </div>
      <div>
        <label className="block mb-1">
          Type
          <span className="text-xs ml-1 text-gray-500">(Optional)</span>
        </label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              disabled={isLoading}
              onValueChange={(value) => field.onChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="terms-and-conditions">
                  Terms and Conditions
                </SelectItem>
                <SelectItem value="privacy-policy">Privacy Policy</SelectItem>
                <SelectItem value="refund-policy">Refund Policy</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {formState.errors.titleAr && (
          <div className="text-red-500 text-xs mt-1">
            {formState.errors.titleAr.message}
          </div>
        )}
      </div>
      <div>
        <label className="block mb-1">Content (English)</label>
        <Controller
          name="contentEn"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Enter page content..."
              disabled={isLoading}
              height={"50vh"}
            />
          )}
        />
        {formState.errors.contentEn && (
          <div className="text-red-500 text-xs mt-1">
            {formState.errors.contentEn.message}
          </div>
        )}
      </div>
      <div>
        <label className="block mb-1">Content (Arabic)</label>
        <Controller
          name="contentAr"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Enter page content..."
              disabled={isLoading}
              height={"50vh"}
            />
          )}
        />
        {formState.errors.contentAr && (
          <div className="text-red-500 text-xs mt-1">
            {formState.errors.contentAr.message}
          </div>
        )}
      </div>
      <div className="flex items-center justify-end gap-4">
        <Button
          size="lg"
          variant="outline"
          type="button"
          className="w-fit"
          disabled={isLoading}
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>

        <Button size="lg" type="submit" loading={isLoading} className="w-fit">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
