import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProtectedComponent } from "@/components/rbac/ProtectedComponent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";
import { PERMISSION_KEYS } from "@/config/permissions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryById, updateCategory } from "../api/category.api";
import { CategoryForm } from "../components/category-form";
import type { CategorySchema } from "../schemas/category.schema";
import { toast } from "sonner";

function CategoryUpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: category,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
  });

  const { mutateAsync: updateCategoryMutation, isPending: submitting } =
    useMutation({
      mutationFn: (formData: FormData) => updateCategory(id!, formData),
      mutationKey: ["category", "update", id],
      onSuccess: () => {
        toast.success("Category updated successfully");
        navigate("/dashboard/categories");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  async function handleSubmit(values: CategorySchema, file: File | null) {
    if (!id) return;

    try {
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
      if (file) formData.append("cover", file);
      // Job Titles
      values.jobTitles.forEach((jt, i) => {
        formData.append(`jobTitles[${i}][ar]`, jt.ar);
        formData.append(`jobTitles[${i}][en]`, jt.en);
      });

      if (values.cycle === "project" && values.media_type) {
        formData.append("media", values.media_type);
      }

      if (
        (values as any).relatedCategories &&
        (values as any).relatedCategories.length > 0 &&
        !values.isRelated &&
        values.cycle === "project"
      ) {
        (values as any).relatedCategories.forEach((rc: string, i: number) => {
          formData.append(`relatedCategory[${i}]`, rc);
        });
      }

      // Subcategories & Tags
      values.subCategories.forEach((sc, i) => {
        formData.append(`subCategories[${i}][title][ar]`, sc.title.ar);
        formData.append(`subCategories[${i}][title][en]`, sc.title.en);
        sc.tags.forEach((tag, j) => {
          formData.append(`subCategories[${i}][tags][${j}][ar]`, tag.ar);
          formData.append(`subCategories[${i}][tags][${j}][en]`, tag.en);
        });
      });
      await updateCategoryMutation(formData);
    } catch (e: unknown) {
      console.log(e);
    }
  }

  return (
    <DashboardLayout className="w-full mx-auto py-8">
      <ProtectedComponent
        permissionKey={PERMISSION_KEYS.CATEGORIES.UPDATE}
        fallback={
          <Alert variant="destructive">
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to update categories.
            </AlertDescription>
          </Alert>
        }
        showFallback={true}
      >
        <h1 className="text-2xl font-bold mb-6">Update Category</h1>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {loading && <Loader className="w-8 h-8 mx-auto mt-10" />}

        {!loading && !error && category && (
          <CategoryForm
            defaultValues={{
              media_type: category.media as "video" | "image" | "audio",
              relatedCategory: category.relatedCategory,
              ...category,
            }}
            onSubmit={handleSubmit}
            submitting={submitting}
            submitLabel="Update"
          />
        )}
      </ProtectedComponent>
    </DashboardLayout>
  );
}

export default CategoryUpdatePage;
