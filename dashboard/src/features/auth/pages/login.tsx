import { type AxiosError } from "axios";
import logo from "../../../../public/logo.svg";
import { useLoginMutation } from "../api/auth.api";
import LoginForm from "../components/login-form";
import { type LoginSchema } from "../schemas/login.schema";

function getErrorMessage(error: unknown): string | null {
  if (
    error &&
    typeof error === "object" &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError
  ) {
    const axiosError = error as AxiosError<{
      errors?: { message?: string }[];
      message?: string;
    }>;
    return axiosError.response?.data?.errors?.[0]?.message || "Login failed";
  }
  return "Login failed";
}

export default function Login() {
  const navigate = (href: string) => (window.location.href = href);
  const { mutateAsync, isPending, error } = useLoginMutation({
    onSuccess: () => {
      console.log("success");
      navigate("/");
    },
  });
  console.log(error, "is errorrr");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className=" flex-col items-center justify-center bg-white text-primary hidden md:flex ">
        <img src={logo} alt="logo" className="w-[60%] h-[60%]" />
      </div>
      <LoginForm
        onSubmit={async (values: LoginSchema) => {
          await mutateAsync(values);
        }}
        loading={isPending}
        error={error ? getErrorMessage(error) : null}
      />
    </div>
  );
}
