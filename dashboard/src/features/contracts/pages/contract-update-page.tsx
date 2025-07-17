import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getContractById, updateContract } from '../api/contract.api';
import { ContractForm } from '../components/contract-form';

export default function ContractUpdatePage() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['contract', id],
    queryFn: () => getContractById(id),
  });
  const { mutateAsync, isPending } = useMutation({ mutationFn: (formData: FormData) => updateContract(id, formData) });
  async function handleSubmit(values: any) {
    const formData = new FormData();
    // Append fields to formData
    await mutateAsync(formData);
  }
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <h1>Update Contract</h1>
      <ContractForm defaultValues={data} onSubmit={handleSubmit} isLoading={isPending} submitLabel="Update" />
    </div>
  );
}
