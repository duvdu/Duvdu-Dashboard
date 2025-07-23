export type PhoneNumber = {
  number: string;
  key?: string | null;
};

export type UserProfile = {
  _id: string;
  name: string;
  username?: string;
  isOnline?: boolean;
  profileImage: string;
  faceRecognition?: string;
  email?: string;
  phoneNumber: PhoneNumber;
};

export type ProjectScale = {
  unit: string;
  numberOfUnits: number;
  unitPrice: number;
};

export type ToolOrFunction = {
  _id: string;
  name: string;
  unitPrice: number;
  units: number;
};

export type SubmitFile = {
  _id: string;
  link: string;
  notes: string;
  reason: string | null;
  dateOfSubmission: string;
  status: string;
};

export type RequestedDeadline = {
  deadline: string | null;
  status: string;
  user: string | null;
};

export type ContractDetails = {
  _id: string;
  sp: string;
  customer: string;
  project: string;
  tools: ToolOrFunction[];
  functions: ToolOrFunction[];
  details: string | null;
  location: { lat: number; lng: number };
  address: string;
  attachments: string[];
  ticketNumber: string;
  projectScale: ProjectScale;
  appointmentDate: string;
  totalPrice: number;
  deadline: string;
  startDate: string;
  stageExpiration: number;
  firstPaymentAmount: number;
  secondPaymentAmount: number;
  status: string;
  rejectedBy: string | null;
  duration: number;
  equipmentPrice: number;
  submitFiles: SubmitFile[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  actionAt?: string;
  paymentLink?: string;
  firstCheckoutAt?: string;
  totalCheckoutAt?: string;
  insurance?: number;
  qrCodeVerification?: boolean;
  requestedDeadline?: RequestedDeadline;
  checkoutAt?: string;
};

export type ContractRoot = {
  _id: string;
  contract: ContractDetails;
  customer: UserProfile;
  sp: UserProfile;
  cancelReason: string;
  user: {
    _id: string;
    name: string;
    profileImage: string;
    email?: string;
    phoneNumber: PhoneNumber;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ContractListResponse = {
  message: string;
  pagination: Pagination;
  data: ContractRoot[];
};
