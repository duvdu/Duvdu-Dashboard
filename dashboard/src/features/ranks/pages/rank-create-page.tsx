import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createRank } from "../api/rank.api";
import { RankForm } from "../components/rank-form";
import type { RankSchema } from "../schemas/rank.schema";

export default function RankCreatePage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createRank,
    mutationKey: ["ranks"],
    onSuccess: () => {
      toast.success("Rank created successfully");
      navigate("/dashboard/ranks");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  async function handleSubmit(values: RankSchema) {
    await mutateAsync(values);
  }
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Create Rank</h1>
      </div>
      <RankForm
        onSubmit={handleSubmit}
        isLoading={isPending}
        submitLabel="Create"
      />
    </DashboardLayout>
  );
}
