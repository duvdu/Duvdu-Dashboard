import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type LoginSchema, loginSchema } from "../schemas/login.schema";

export default function LoginForm({
  onSubmit,
  loading,
  error,
}: {
  onSubmit: (values: LoginSchema) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
}) {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const handleSubmit = async (values: LoginSchema) => {
    await onSubmit(values);
  };

  return (
    <div className="flex items-center  bg-primary justify-center min-h-screen px-24">
      <Card className="w-full max-w-lg bg-white text-primary rounded-xl shadow-xl border mx-auto p-8 ">
        <CardHeader className="mb-1">
          <CardTitle className="text-2xl font-semibold">
            Sign in to your account
          </CardTitle>
          <CardDescription className="text-base mt-1">
            Enter your credentials to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Username"
                        disabled={loading}
                        className="h-12 text-base px-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        disabled={loading}
                        className="h-12 text-base px-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              {error && (
                <Alert
                  variant="destructive"
                  className="bg-red-50 border-red-200 text-red-800 text-base"
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <CardFooter className="px-0 mt-1">
                <Button
                  loading={loading}
                  type="submit"
                  className="w-full h-12 text-base"
                >
                  Sign in
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
