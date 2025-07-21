import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createCustomPage } from "../api/custom-page.api";
import { CustomPageForm } from "../components/custom-page-form";

export default function CustomPageCreatePage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createCustomPage,
    mutationKey: ["custom-pages", "create"],
    onSuccess: () => {
      toast.success("Custom page created successfully");
      navigate("/custom-pages");
    },
  });
  async function handleSubmit(values: any) {
    await mutateAsync(values);
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
