export type FundTransaction = {
  _id?: string;
  fundAmount: number;
  withdrawMethod: string;
  fundAttachment?: string;
  status: "pending" | "success" | "failed";
  createdAt?: string;
  user?: string;
};
