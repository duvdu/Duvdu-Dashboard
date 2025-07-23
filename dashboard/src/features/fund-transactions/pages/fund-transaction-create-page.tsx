import { useMutation } from "@tanstack/react-query";
import { createFundTransaction } from "../api/fund-transaction.api";
import { FundTransactionForm } from "../components/fund-transaction-form";
import type { FundTransactionSchema } from "../schemas/fund-transaction.schema";

export default function FundTransactionCreatePage() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createFundTransaction,
  });
  async function handleSubmit(values: FundTransactionSchema) {
    const formData = new FormData();
    formData.append("fundAmount", values.fundAmount.toString());
    formData.append("withdrawMethod", values.withdrawMethod);
    if (values.fundAttachment && values.fundAttachment[0]) {
      formData.append("fundAttachment", values.fundAttachment[0]);
    }
    await mutateAsync(formData);
  }
  return (
    <div>
      <h1>Create FundTransaction</h1>
      <FundTransactionForm
        onSubmit={handleSubmit}
        isLoading={isPending}
        submitLabel="Create"
      />
    </div>
  );
}
