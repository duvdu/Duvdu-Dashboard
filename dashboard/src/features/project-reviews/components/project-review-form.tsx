import { useForm } from 'react-hook-form';
import type { ProjectReviewSchema } from '../schemas/project-review.schema';

export type ProjectReviewFormProps = {
  defaultValues?: Partial<ProjectReviewSchema>;
  onSubmit: (values: ProjectReviewSchema, file?: File) => void;
  isLoading?: boolean;
  submitLabel?: string;
};

export function ProjectReviewForm({ defaultValues, onSubmit, isLoading, submitLabel = 'Save' }: ProjectReviewFormProps) {
  const methods = useForm<ProjectReviewSchema>({ defaultValues });
  const { handleSubmit, control } = methods;
  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-6">
      {/* Add your form fields here */}
      <button type="submit" disabled={isLoading}>{submitLabel}</button>
    </form>
  );
}
