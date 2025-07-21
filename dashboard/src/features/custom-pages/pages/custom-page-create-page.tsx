import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMutation } from "@tanstack/react-query";
import { createCustomPage } from "../api/custom-page.api";
import { CustomPageForm } from "../components/custom-page-form";

export default function CustomPageCreatePage() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createCustomPage,
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
