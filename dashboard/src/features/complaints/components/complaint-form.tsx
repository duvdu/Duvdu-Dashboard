import { useForm } from 'react-hook-form';
import type { ComplaintSchema } from '../schemas/complaint.schema';

export type ComplaintFormProps = {
  defaultValues?: Partial<ComplaintSchema>;
  onSubmit: (values: ComplaintSchema, file?: File) => void;
  isLoading?: boolean;
  submitLabel?: string;
};

export function ComplaintForm({ defaultValues, onSubmit, isLoading, submitLabel = 'Save' }: ComplaintFormProps) {
  const methods = useForm<ComplaintSchema>({ defaultValues });
  const { handleSubmit, control } = methods;
  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-6">
      {/* Add your form fields here */}
      <button type="submit" disabled={isLoading}>{submitLabel}</button>
    </form>
  );
}
