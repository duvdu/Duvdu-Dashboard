import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useModal } from "@/store/modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { fundTransaction } from "../api/transactions.api";

const fundTransactionSchema = (maxAmount: number) =>
  z.object({
    fundingAmount: z
      .number()
      .min(1, "Amount must be at least 1")
      .max(
        maxAmount,
        `Amount cannot exceed the transaction amount (${maxAmount})`
      ),
    fundAttachment: z.any().optional(),
  });

type FundTransactionForm = z.infer<ReturnType<typeof fundTransactionSchema>>;

export function FundTransactionModal() {
  const { data, isOpen, type, onClose, refetch } = useModal();
  const isModalOpen = isOpen && type === "fundTransaction";
  const maxAmount = data?.amount ?? 0;

  const form = useForm<FundTransactionForm>({
    resolver: zodResolver(fundTransactionSchema(maxAmount)),
    defaultValues: { fundingAmount: 0, fundAttachment: undefined },
  });

  const { mutateAsync: fundTransactionMutation, isPending } = useMutation({
    mutationFn: async (values: FundTransactionForm) => {
      if (!data?.id) throw new Error("No transaction ID");
      return fundTransaction(
        data.id,
        values.fundingAmount,
        values.fundAttachment?.[0]
      );
    },
    onSuccess: () => {
      toast.success("Transaction funded successfully");
      if (refetch) refetch();
      onClose();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.errors?.[0]?.message || "Failed to payout"
      );
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await fundTransactionMutation(values);
  });

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="min-w-[24vw] gap-8 rounded-3xl text-center">
        <DialogHeader>
          <DialogTitle>Payout</DialogTitle>
          <DialogDescription>
            Enter the amount to fund this transaction.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="number"
            step="any"
            {...form.register("fundingAmount", { valueAsNumber: true })}
            placeholder="Funding Amount"
            disabled={isPending}
          />
          {form.formState.errors.fundingAmount && (
            <span className="text-destructive text-xs">
              {form.formState.errors.fundingAmount.message}
            </span>
          )}
          <Input
            type="file"
            accept="*"
            {...form.register("fundAttachment")}
            disabled={isPending}
          />
          {form.formState.errors.fundAttachment && (
            <span className="text-destructive text-xs">
              {form.formState.errors.fundAttachment?.message as string}
            </span>
          )}
          <DialogFooter className="flex gap-2 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={isPending}
              disabled={isPending}
            >
              Fund
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FundTransactionModal;
