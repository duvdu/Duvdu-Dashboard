import { useMutation } from '@tanstack/react-query';
import { createComplaint } from '../api/complaint.api';
import { ComplaintForm } from '../components/complaint-form';

export default function ComplaintCreatePage() {
  const { mutateAsync, isPending } = useMutation({ mutationFn: createComplaint });
  async function handleSubmit(values: any) {
    const formData = new FormData();
    // Append fields to formData
    await mutateAsync(formData);
  }
  return (
    <div>
      <h1>Create Complaint</h1>
      <ComplaintForm onSubmit={handleSubmit} isLoading={isPending} submitLabel="Create" />
    </div>
  );
}
