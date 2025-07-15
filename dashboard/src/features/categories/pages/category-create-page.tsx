import DashboardLayout from "@/components/layout/DashboardLayout";
import { Loader } from "@/components/ui/loader";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createCategory } from "../api/category.api";
import { CategoryForm } from "../components/category-form";
import type { CategorySchema } from "../schemas/category.schema";

declare global {
  interface Error {
    response?: {
      data?: {
        errors?: {
          message?: string;
        }[];
      };
    };
  }
}
function CategoryCreatePage() {
  const navigate = useNavigate();
  const { mutateAsync: createCategoryMutation, isPending } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Category created successfully");
      navigate("../categories");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.errors?.[0]?.message ||
          "Failed to create category"
      );
    },
  });

  async function handleSubmit(values: CategorySchema, file: File | null) {
    const formData = new FormData();
    formData.append("title[ar]", values.title.ar);
    formData.append("title[en]", values.title.en);
    formData.append("cycle", values.cycle);
    formData.append("status", values.status ? "true" : "false");
    if (values.trend !== undefined)
      formData.append("trend", values.trend ? "true" : "false");
    if (values.isRelated !== undefined)
      formData.append("isRelated", values.isRelated ? "true" : "false");
    if (values.insurance !== undefined)
      formData.append("insurance", values.insurance ? "true" : "false");
    if (file) formData.append("cover", values.image);
    // Job Titles
    values.jobTitles.forEach((jt, i) => {
      formData.append(`jobTitles[${i}][ar]`, jt.ar);
      formData.append(`jobTitles[${i}][en]`, jt.en);
    });
    // Subcategories & Tags
    values.subCategories.forEach((sc, i) => {
      formData.append(`subCategories[${i}][title][ar]`, sc.title.ar);
      formData.append(`subCategories[${i}][title][en]`, sc.title.en);
      sc.tags.forEach((tag, j) => {
        formData.append(`subCategories[${i}][tags][${j}][ar]`, tag.ar);
        formData.append(`subCategories[${i}][tags][${j}][en]`, tag.en);
      });
    });
    await createCategoryMutation(formData);
  }

  return (
    <DashboardLayout className="w-full mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create Category</h1>

      <CategoryForm
        onSubmit={handleSubmit}
        isLoading={isPending}
        submitLabel="Create"
      />
      {isPending && <Loader className="w-8 h-8 mt-4" />}
    </DashboardLayout>
  );
}

export default CategoryCreatePage;
