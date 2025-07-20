import { useForm } from 'react-hook-form';
import type { TicketSchema } from '../schemas/ticket.schema';

export type TicketFormProps = {
  defaultValues?: Partial<TicketSchema>;
  onSubmit: (values: TicketSchema, file?: File) => void;
  isLoading?: boolean;
  submitLabel?: string;
};

export function TicketForm({ defaultValues, onSubmit, isLoading, submitLabel = 'Save' }: TicketFormProps) {
  const methods = useForm<TicketSchema>({ defaultValues });
  const { handleSubmit, control } = methods;
  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-6">
      {/* Add your form fields here */}
      <button type="submit" disabled={isLoading}>{submitLabel}</button>
    </form>
  );
}
