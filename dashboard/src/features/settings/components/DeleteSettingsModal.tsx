import { Button } from "@/components/ui/button";
import { useModal } from "@/store/modal-store";
// import { deleteSettings } from "../api/setting.api";

export function DeleteSettingsModal() {
  const { data, isOpen, onClose, refetch } = useModal();
  const isModalOpen = isOpen;
  //  && type === 'deleteSettings';
  const handleDelete = async () => {
    if (!data?.id) return;
    // await deleteSettings(data.id);
    if (refetch) refetch();
    onClose();
  };
  if (!isModalOpen) return null;
  return (
    <div>
      <h2>Delete Settings</h2>
      <p>Are you sure you want to delete this setting?</p>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={handleDelete}>Delete</Button>
    </div>
  );
}
