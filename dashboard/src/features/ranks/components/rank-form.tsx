import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import type { RankSchema } from "../schemas/rank.schema";

export type RankFormProps = {
  defaultValues?: Partial<RankSchema>;
  onSubmit: (values: RankSchema) => void;
  isLoading?: boolean;
  submitLabel?: string;
};

export function RankForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Save",
}: RankFormProps) {
  const methods = useForm<RankSchema>({ defaultValues });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;
  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values))}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="rank">Rank Name</Label>
        <Input id="rank" {...register("rank", { required: true })} />
        {errors.rank && (
          <span className="text-red-500">{errors.rank.message}</span>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="actionCount">Contracts Count</Label>
        <Input
          id="actionCount"
          type="number"
          {...register("actionCount", { valueAsNumber: true, required: true })}
        />
        {errors.actionCount && (
          <span className="text-red-500">{errors.actionCount.message}</span>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="projectsCount">Projects Count</Label>
        <Input
          id="projectsCount"
          type="number"
          {...register("projectsCount", {
            valueAsNumber: true,
            required: true,
          })}
        />
        {errors.projectsCount && (
          <span className="text-red-500">{errors.projectsCount.message}</span>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="projectsLiked">Projects Liked</Label>
        <Input
          id="projectsLiked"
          type="number"
          {...register("projectsLiked", {
            valueAsNumber: true,
            required: true,
          })}
        />
        {errors.projectsLiked && (
          <span className="text-red-500">{errors.projectsLiked.message}</span>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          type="color"
          className="w-24"
          {...register("color", { required: true })}
        />
        {errors.color && (
          <span className="text-red-500">{errors.color.message}</span>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link to="/dashboard/ranks">Cancel</Link>
        </Button>
        <Button loading={isLoading} type="submit" disabled={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
