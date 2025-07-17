import { useForm } from 'react-hook-form';
import type { ContractSchema } from '../schemas/contract.schema';

export type ContractFormProps = {
  defaultValues?: Partial<ContractSchema>;
  onSubmit: (values: ContractSchema, file?: File) => void;
  isLoading?: boolean;
  submitLabel?: string;
};

export function ContractForm({ defaultValues, onSubmit, isLoading, submitLabel = 'Save' }: ContractFormProps) {
  const methods = useForm<ContractSchema>({ defaultValues });
  const { handleSubmit, control } = methods;
  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-6">
      {/* Add your form fields here */}
      <button type="submit" disabled={isLoading}>{submitLabel}</button>
    </form>
  );
}
