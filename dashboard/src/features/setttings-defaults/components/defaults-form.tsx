import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { updateDefaults } from "../api/defaults.api";
import {
  defaultsUpdateSchema,
  type DefaultsUpdateFormValues,
} from "../schemas/defaults.schema";

export function DefaultsForm() {
  const form = useForm<DefaultsUpdateFormValues>({
    resolver: zodResolver(defaultsUpdateSchema),
    defaultValues: { profile: undefined, cover: undefined },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function onSubmit(values: DefaultsUpdateFormValues) {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await updateDefaults(values);
      setSuccess(true);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to update defaults");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-md mx-auto"
      >
        <FormField
          control={form.control}
          name="profile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <FormControl>
                <ImageUploader
                  value={field.value}
                  onChange={field.onChange}
                  disabled={loading}
                  label="Profile Image"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cover"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <ImageUploader
                  value={field.value}
                  onChange={field.onChange}
                  disabled={loading}
                  label="Cover Image"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && (
          <div className="text-green-600 text-sm">
            Defaults updated successfully
          </div>
        )}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Updating..." : "Update Defaults"}
        </Button>
      </form>
    </Form>
  );
}
