import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/store/modal-store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { closeFundTransaction } from "../api/fund-transaction.api";
import type { FundTransactionSchema } from "../schemas/fund-transaction.schema";
import { FundTransactionForm } from "./fund-transaction-form";

export function CloseFundTransactionModal() {
  const { isOpen, type, onClose, data, refetch } = useModal();
  const isModalOpen = isOpen && type === "closeFundTransaction";
  const transactionId = data?.id;
  const userId = data?.userId;
  const withdrawMethodId = data?.withdrawMethodId;
  const fundAmount = data?.fundAmount;

  const { mutateAsync: closeFundTransactionMutation, isPending } = useMutation({
    mutationFn: (formData: FormData) => {
      if (!transactionId) throw new Error("No transaction ID");
      return closeFundTransaction(transactionId, formData);
    },
    mutationKey: ["fund-transactions", transactionId],
    onSuccess: () => {
      toast.success("Transaction funded successfully");
      if (refetch) refetch();
      handleClose();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.errors?.[0]?.message ||
          "Failed to fund transaction"
      );
    },
  });

  const handleSubmit = (data: FundTransactionSchema) => {
    const formData = new FormData();
    formData.append("withdrawMethod", data.withdrawMethod);
    // formData.append("fundAmount", fundAmount);
    formData.append("fundAttachment", data.fundAttachment);
    closeFundTransactionMutation(formData);
  };

  const handleClose = () => {
    onClose();
  };

  if (!isModalOpen) return null;
  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="min-w-[24vw] gap-8 rounded-3xl text-center">
        <DialogHeader>
          <DialogTitle> Fund Transaction</DialogTitle>
        </DialogHeader>

        <FundTransactionForm
          onSubmit={handleSubmit}
          isLoading={isPending}
          onCancel={onClose}
          defaultValues={{
            user: userId,
            withdrawMethod: withdrawMethodId,
            fundAmount: fundAmount,
          }}
          submitLabel="Fund Transaction"
        />
      </DialogContent>
    </Dialog>
  );
}

export default CloseFundTransactionModal;
