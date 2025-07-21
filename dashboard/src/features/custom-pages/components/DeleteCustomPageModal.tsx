import { deleteCustomPage } from '../api/custom-page.api';
import { useModal } from '@/store/modal-store';
import { Button } from '@/components/ui/button';

export function DeleteCustomPageModal() {
  const { data, isOpen, type, onClose, refetch } = useModal();
  const isModalOpen = isOpen && type === 'deleteCustomPage';
  const handleDelete = async () => {
    if (!data?.id) return;
    await deleteCustomPage(data.id);
    if (refetch) refetch();
    onClose();
  };
  if (!isModalOpen) return null;
  return (
    <div>
      <h2>Delete CustomPage</h2>
      <p>Are you sure you want to delete this custom-page?</p>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={handleDelete}>Delete</Button>
    </div>
  );
}
