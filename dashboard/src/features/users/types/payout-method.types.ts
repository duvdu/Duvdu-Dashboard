export type PayoutMethod = {
  _id: string;
  user: string;
  method: "bank" | "wallet";
  name: string;
  number: string;
  iban?: string;
  isDeleted: boolean;
  status: "active" | "disabled";
  default: boolean;
  __v?: number;
};

export type PayoutMethodPagination = {
  currentPage: number;
  resultCount: number;
  totalPages: number;
};

export type PayoutMethodListResponse = {
  message: string;
  pagination: PayoutMethodPagination;
  data: PayoutMethod[];
};
