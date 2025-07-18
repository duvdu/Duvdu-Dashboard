import { deleteComplaint } from '../api/complaint.api';
import { useModal } from '@/store/modal-store';
import { Button } from '@/components/ui/button';

export function DeleteComplaintModal() {
  const { data, isOpen, type, onClose, refetch } = useModal();
  const isModalOpen = isOpen && type === 'deleteComplaint';
  const handleDelete = async () => {
    if (!data?.id) return;
    await deleteComplaint(data.id);
    if (refetch) refetch();
    onClose();
  };
  if (!isModalOpen) return null;
  return (
    <div>
      <h2>Delete Complaint</h2>
      <p>Are you sure you want to delete this complaint?</p>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={handleDelete}>Delete</Button>
    </div>
  );
}
