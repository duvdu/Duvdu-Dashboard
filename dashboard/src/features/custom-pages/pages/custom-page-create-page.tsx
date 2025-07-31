import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createCustomPage } from "../api/custom-page.api";
import { CustomPageForm } from "../components/custom-page-form";
import type { CustomPageSchema } from "../schemas/custom-page.schema";

export default function CustomPageCreatePage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createCustomPage,
    mutationKey: ["custom-pages", "create"],
    onSuccess: () => {
      toast.success("Custom page created successfully");
      navigate("/dashboard/custom-pages");
    },
    onError: (error) => {
      toast.error(
        error.response.data?.errors[0]?.message ||
          error.message ||
          "Something went wrong"
      );
    },
  });
  async function handleSubmit(values: CustomPageSchema) {
    await mutateAsync({
      title: {
        en: values.titleEn,
        ar: values.titleAr,
      },
      content: {
        en: values.contentEn,
        ar: values.contentAr,
      },
      type: values.type,
    });
  }
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <h1>Create CustomPage</h1>
        <CustomPageForm
          onSubmit={handleSubmit}
          isLoading={isPending}
          submitLabel="Create"
        />
      </div>
    </DashboardLayout>
  );
}
