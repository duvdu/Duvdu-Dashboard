import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRoles } from "@/features/roles/api/roles.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  type CreateAdminSchema,
  type UpdateAdminSchema,
  adminSchema,
} from "../schemas/admin.schema";

export type AdminFormProps = {
  defaultValues?: Partial<CreateAdminSchema | UpdateAdminSchema>;
  onSubmit: (values: CreateAdminSchema) => void;
  isLoading?: boolean;
  submitLabel?: string;
};

export function AdminForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Save",
}: AdminFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const methods = useForm<CreateAdminSchema | UpdateAdminSchema>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: "",
      username: "",
      phoneNumber: "",
      password: "",
      role: "",
      email: "",
      ...defaultValues,
    },
    mode: "onChange",
  });
  const { handleSubmit, control } = methods;

  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  return (
    <Form {...methods}>
      <form
        onSubmit={handleSubmit((values) =>
          onSubmit(values as CreateAdminSchema)
        )}
        className="space-y-6"
      >
        {/* <FormField
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
            /> */}

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
            name="role"
            control={control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={rolesLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          rolesLoading ? "Loading roles..." : "Select role"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role._id} value={role._id}>
                          {role.key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

        <FormField
          name="password"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2 relative">
                  <Input
                    {...field}
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  >
                    {showPassword ? (
                      <EyeIcon className="h-4 w-4" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" />
                    )}
                  </Button>
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
