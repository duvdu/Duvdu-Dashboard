import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/store/modal-store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createFundTransaction } from "../api/fund-transaction.api";
import type { FundTransactionSchema } from "../schemas/fund-transaction.schema";
import { FundTransactionForm } from "./fund-transaction-form";

export function CreateFundTransactionModal() {
  const { isOpen, type, onClose } = useModal();
  const isModalOpen = isOpen && type === "createFundTransaction";

  const { mutateAsync: createFundTransactionMutation, isPending } = useMutation(
    {
      mutationFn: (formData: FormData) => createFundTransaction(formData),
      mutationKey: ["fund-transactions", "create"],
      onSuccess: () => {
        toast.success("Fund Transaction created successfully");
        handleClose();
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.errors?.[0]?.message ||
            "Failed to create fund transaction"
        );
      },
    }
  );

  const handleSubmit = (data: FundTransactionSchema) => {
    const formData = new FormData();
    Object.entries(data)
      .filter(([, value]) => value)
      .forEach(([key, value]) => {
        formData.append(key, value as string);
      });

    createFundTransactionMutation(formData);
  };

  const handleClose = () => {
    onClose();
  };

  if (!isModalOpen) return null;
  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="min-w-[24vw] gap-8 rounded-3xl text-center">
        <DialogHeader>
          <DialogTitle>Create Fund Transaction</DialogTitle>
        </DialogHeader>

        <FundTransactionForm
          onSubmit={handleSubmit}
          isLoading={isPending}
          submitLabel="Create"
        />
      </DialogContent>
    </Dialog>
  );
}
