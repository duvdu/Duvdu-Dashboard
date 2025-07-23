import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardLoader from "@/components/layout/DashboardLoader";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getRankById, updateRank } from "../api/rank.api";
import { RankForm } from "../components/rank-form";
import type { RankSchema } from "../schemas/rank.schema";

export default function RankUpdatePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["rank", id],
    queryFn: () => getRankById(id),
  });
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: RankSchema) => updateRank(id, values),
    mutationKey: ["ranks"],
    onSuccess: () => {
      toast.success("Rank updated successfully");
      navigate("/dashboard/ranks");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  async function handleSubmit(values: RankSchema) {
    await mutateAsync(values);
  }
  if (isLoading) return <DashboardLoader />;
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Update Rank</h1>
      </div>
      <RankForm
        defaultValues={data}
        onSubmit={handleSubmit}
        isLoading={isPending}
        submitLabel="Update"
      />
    </DashboardLayout>
  );
}
