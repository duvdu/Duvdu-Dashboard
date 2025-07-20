import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getProjectReviewById, updateProjectReview } from '../api/project-review.api';
import { ProjectReviewForm } from '../components/project-review-form';

export default function ProjectReviewUpdatePage() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['project-review', id],
    queryFn: () => getProjectReviewById(id),
  });
  const { mutateAsync, isPending } = useMutation({ mutationFn: (formData: FormData) => updateProjectReview(id, formData) });
  async function handleSubmit(values: any) {
    const formData = new FormData();
    // Append fields to formData
    await mutateAsync(formData);
  }
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <h1>Update ProjectReview</h1>
      <ProjectReviewForm defaultValues={data} onSubmit={handleSubmit} isLoading={isPending} submitLabel="Update" />
    </div>
  );
}
