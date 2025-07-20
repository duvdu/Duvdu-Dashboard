import { deleteProjectReview } from '../api/project-review.api';
import { useModal } from '@/store/modal-store';
import { Button } from '@/components/ui/button';

export function DeleteProjectReviewModal() {
  const { data, isOpen, type, onClose, refetch } = useModal();
  const isModalOpen = isOpen && type === 'deleteProjectReview';
  const handleDelete = async () => {
    if (!data?.id) return;
    await deleteProjectReview(data.id);
    if (refetch) refetch();
    onClose();
  };
  if (!isModalOpen) return null;
  return (
    <div>
      <h2>Delete ProjectReview</h2>
      <p>Are you sure you want to delete this project-review?</p>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={handleDelete}>Delete</Button>
    </div>
  );
}
