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
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  type UpdateUserSchema,
  updateUserSchema,
} from "../schemas/user.schema";

export type UserFormProps = {
  defaultValues?: Partial<UpdateUserSchema>;
  onSubmit: (values: UpdateUserSchema) => void;
  isLoading?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
};

export function UserForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Save",
  onCancel,
}: UserFormProps) {
  const methods = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      username: "",
      phoneNumber: "",
      email: "",
      availableContracts: 0,
      profileImage: null,
      coverImage: null,
      ...defaultValues,
    },
    mode: "onChange",
  });
  const { handleSubmit, control } = methods;

  function handleCancel() {
    methods.reset();
    onCancel?.();
  }

  return (
    <Form {...methods}>
      <form
        onSubmit={handleSubmit((values) => onSubmit(values))}
        className="space-y-6"
      >
        <FormField
          name="coverImage"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <ImageUploader
                  value={field.value}
                  onChange={(file) => {
                    field.onChange(file);
                  }}
                  label=""
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="profileImage"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <FormControl>
                <ImageUploader
                  value={field.value}
                  onChange={(file) => {
                    field.onChange(file);
                  }}
                  label=""
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="name"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Full Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="username"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Username" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="availableContracts"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Contracts</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    placeholder="0"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="email"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PhoneInput
                  {...field}
                  placeholder="Eg. 0123456789"
                  label="Phone Number"
                  onChange={(value) => field.onChange(value)}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            className="mr-2 flex-1"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isLoading} className="flex-1">
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
