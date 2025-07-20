import { useMutation } from '@tanstack/react-query';
import { createProjectReview } from '../api/project-review.api';
import { ProjectReviewForm } from '../components/project-review-form';

export default function ProjectReviewCreatePage() {
  const { mutateAsync, isPending } = useMutation({ mutationFn: createProjectReview });
  async function handleSubmit(values: any) {
    const formData = new FormData();
    // Append fields to formData
    await mutateAsync(formData);
  }
  return (
    <div>
      <h1>Create ProjectReview</h1>
      <ProjectReviewForm onSubmit={handleSubmit} isLoading={isPending} submitLabel="Create" />
    </div>
  );
}
