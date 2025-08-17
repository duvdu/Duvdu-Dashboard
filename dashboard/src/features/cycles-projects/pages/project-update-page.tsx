import DashboardLayout from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getProjectById, updateProject } from "../api/project.api";
import { ProjectForm } from "../components/project-form";
import { type ProjectFormSchema } from "../schemas/project.schema";

export default function ProjectUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id),
  });

  const { mutateAsync: updateProjectMutation, isPending: submitting } =
    useMutation({
      mutationFn: (formData: FormData) => updateProject(id, formData),
      mutationKey: ["projects", id],
      onSuccess: () => {
        toast.success("Project updated successfully");
        navigate("/dashboard/projects");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to update project"
        );
      },
    });

  const initialValues = useMemo(() => {
    if (!data) return null;
    return {
      name: data.name || "",
      description: data.description || "",
      duration: data.duration?.toString() || "",
      address: data.address || "",
      category: data.category?._id || "",
      subCategory: data.subCategory?._id || "",
      tags: data.tags?.map((t: any) => t._id) || [],
      relatedCategory: data.relatedCategory?.[0]?.category?._id || "",
      relatedSubCategory:
        data.relatedCategory?.[0]?.category?.subCategories?.[0]?._id || "",
      relatedTags:
        data.relatedCategory?.[0]?.category?.subCategories?.[0]?.tags?.map(
          (item: any) => item?._id
        ) || [],
      attachments: data.attachments || [],
      cover: data.cover || undefined,
      audioCover: data.audioCover ? [data.audioCover] : [],
      location: data.location || { lat: 0, lng: 0 },
      tools:
        data.tools?.map((tool: any) => ({
          name: tool.name,
          unitPrice: tool.unitPrice,
        })) || [],
      functions:
        data.functions?.map((fn: any) => ({
          name: fn.name,
          unitPrice: fn.unitPrice,
        })) || [],
      searchKeyWords: data.searchKeyWords || [],
      showOnHome: !!data.showOnHome,
      projectScale: {
        unit: data.projectScale?.unit as
          | "seconds"
          | "minutes"
          | "hours"
          | "episodes",
        pricerPerUnit: data.projectScale?.pricerPerUnit?.toString() || "",
        minimum: data.projectScale?.minimum?.toString() || "",
        current: data.projectScale?.current?.toString() || "",
        maximum: data.projectScale?.maximum?.toString() || "",
      },
    };
  }, [data]);

  const handleSubmit = useCallback(
    async (values: ProjectFormSchema) => {
      const formData = new FormData();
      if (values.name) formData.append("name", values.name);
      if (values.description)
        formData.append("description", values.description);
      if (values.duration)
        formData.append("duration", values.duration.toString());
      if (values.address) formData.append("address", values.address);
      if (values.category) formData.append("category", values.category);
      if (values.subCategory)
        formData.append("subCategoryId", values.subCategory);
      if (values.tags.length > 0) {
        values.tags.forEach((tag, i) => {
          formData.append(`tagsId[${i}]`, tag);
        });
      }
      if (values.relatedCategory)
        formData.append("relatedCategory[0][category]", values.relatedCategory);
      if (values.relatedSubCategory)
        formData.append(
          "relatedCategory[0][subCategories][0][subCategory]",
          values.relatedSubCategory
        );
      if (values.relatedTags.length > 0) {
        values.relatedTags.forEach((tag, i) => {
          formData.append(
            `relatedCategory[0][subCategories][0][tags][${i}][tag]`,
            tag
          );
        });
      }
      if (values.attachments.length > 0) {
        values.attachments.forEach((attachment, i) => {
          formData.append(`attachments[${i}]`, attachment);
        });
      }
      if (values.cover) formData.append("cover", values.cover);
      // if (values.audioCover)
      //   formData.append("audioCover", values.audioCover.join(","));
      if (values.location.lat)
        formData.append("location[lat]", values.location.lat.toString());
      if (values.location.lng)
        formData.append("location[lng]", values.location.lng.toString());
      if (values.tools.length > 0) {
        values.tools.forEach((tool, i) => {
          formData.append(`tools[${i}][name]`, tool.name);
          formData.append(`tools[${i}][unitPrice]`, tool.unitPrice.toString());
        });
      }
      if (values.functions.length > 0) {
        values.functions.forEach((fn, i) => {
          formData.append(`functions[${i}][name]`, fn.name);
          formData.append(
            `functions[${i}][unitPrice]`,
            fn.unitPrice.toString()
          );
        });
      }
      if (values.searchKeyWords.length > 0) {
        values.searchKeyWords.forEach((word, i) => {
          formData.append(`searchKeyWords[${i}]`, word);
        });
      }

      if (values.showOnHome)
        formData.append("showOnHome", values.showOnHome.toString());
      if (values.projectScale.unit) {
        formData.append("projectScale[unit]", values.projectScale.unit);
        formData.append(
          "projectScale[pricerPerUnit]",
          values.projectScale.pricerPerUnit.toString()
        );
        formData.append(
          "projectScale[minimum]",
          values.projectScale.minimum.toString()
        );
        formData.append(
          "projectScale[current]",
          values.projectScale.current.toString()
        );
        formData.append(
          "projectScale[maximum]",
          values.projectScale.maximum.toString()
        );
      }

      updateProjectMutation(formData);
    },
    [updateProjectMutation]
  );

  if (error) return <div className="text-red-500 p-4">{error.message}</div>;

  if (data && !data?.canEdit) {
    return (
      <DashboardLayout>
        <Alert className="justify-center" variant="destructive">
          <AlertTitle>Project is not editable</AlertTitle>
          <AlertDescription>
            This Project has an active contract.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout loading={loading}>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </Button>
        Edit Project
      </h1>
      <ProjectForm
        initialValues={initialValues as any}
        onSubmit={handleSubmit}
        isLoading={submitting}
      />
    </DashboardLayout>
  );
}
