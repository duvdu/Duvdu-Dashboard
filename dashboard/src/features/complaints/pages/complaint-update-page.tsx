import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getComplaintById, updateComplaint } from '../api/complaint.api';
import { ComplaintForm } from '../components/complaint-form';

export default function ComplaintUpdatePage() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['complaint', id],
    queryFn: () => getComplaintById(id),
  });
  const { mutateAsync, isPending } = useMutation({ mutationFn: (formData: FormData) => updateComplaint(id, formData) });
  async function handleSubmit(values: any) {
    const formData = new FormData();
    // Append fields to formData
    await mutateAsync(formData);
  }
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <h1>Update Complaint</h1>
      <ComplaintForm defaultValues={data} onSubmit={handleSubmit} isLoading={isPending} submitLabel="Update" />
    </div>
  );
}
