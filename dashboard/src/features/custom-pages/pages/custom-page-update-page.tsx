import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getCustomPageById, updateCustomPage } from "../api/custom-page.api";
import { CustomPageForm } from "../components/custom-page-form";

export default function CustomPageUpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["custom-page", id],
    queryFn: () => getCustomPageById(id),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: any) => updateCustomPage(id, values),
    mutationKey: ["custom-page", "update"],
    onSuccess: () => {
      toast.success("Custom page updated successfully");
      navigate(`/dashboard/custom-pages/${id}`);
    },
  });

  async function handleSubmit(values: any) {
    await mutateAsync(values);
  }
  if (isLoading) return <div>Loading...</div>;
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to={`/dashboard/custom-pages/${id}`}>
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
            </Link>
          </Button>

          <h1 className="text-2xl font-bold">Update Custom Page</h1>
        </div>
        <CustomPageForm
          defaultValues={data}
          onSubmit={handleSubmit}
          isLoading={isPending}
          submitLabel="Update"
        />
      </div>
    </DashboardLayout>
  );
}
