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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserSearchSelect } from "@/features/chat/components/UserSearchSelect";
import { getAllPayoutMethods } from "@/features/payout-methods/api/payout-methods.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  fundTransactionSchema,
  type FundTransactionSchema,
} from "../schemas/fund-transaction.schema";

export type FundTransactionFormProps = {
  defaultValues?: Partial<FundTransactionSchema>;
  onSubmit: (values: FundTransactionSchema, file?: File) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
};

export function FundTransactionForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel = "Save",
}: FundTransactionFormProps) {
  const form = useForm<FundTransactionSchema>({
    resolver: zodResolver(fundTransactionSchema),
    defaultValues,
  });
  const user = form.watch("user");

  const { data: payoutMethodsData } = useQuery({
    queryKey: ["payout-methods"],
    queryFn: () => getAllPayoutMethods({ user }),
    enabled: !!user,
  });
  const payoutMethods = payoutMethodsData?.data || [];

  const handleSubmit = (values: FundTransactionSchema) => {
    console.log("values", values);
    onSubmit(values);
  };

  console.log("form", form.formState.errors);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          name="user"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>User</FormLabel>
              <FormControl>
                <UserSearchSelect
                  onSelectUser={(user) => field.onChange(user?._id || "")}
                  selectedUserId={field.value}
                  placeholder="Search and select a user..."
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="fundAmount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fund Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="any"
                  placeholder="Enter fund amount"
                  disabled={isLoading}
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="withdrawMethod"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Withdraw Method</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select withdraw method" />
                  </SelectTrigger>
                  <SelectContent>
                    {user ? (
                      payoutMethods && payoutMethods.length > 0 ? (
                        payoutMethods.map((method: any) => (
                          <SelectItem key={method._id} value={method._id}>
                            {method.name} ({method.method})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled value="no">
                          No payout methods found
                        </SelectItem>
                      )
                    ) : (
                      <SelectItem disabled value="a">
                        Please select a user
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="fundAttachment"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attachment </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  disabled={isLoading}
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button onClick={onCancel} variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
