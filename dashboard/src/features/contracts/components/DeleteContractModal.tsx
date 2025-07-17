import { deleteContract } from '../api/contract.api';
import { useModal } from '@/store/modal-store';
import { Button } from '@/components/ui/button';

export function DeleteContractModal() {
  const { data, isOpen, type, onClose, refetch } = useModal();
  const isModalOpen = isOpen && type === 'deleteContract';
  const handleDelete = async () => {
    if (!data?.id) return;
    await deleteContract(data.id);
    if (refetch) refetch();
    onClose();
  };
  if (!isModalOpen) return null;
  return (
    <div>
      <h2>Delete Contract</h2>
      <p>Are you sure you want to delete this contract?</p>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={handleDelete}>Delete</Button>
    </div>
  );
}
