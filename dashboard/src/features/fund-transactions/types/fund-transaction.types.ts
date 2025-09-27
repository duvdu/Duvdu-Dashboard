import type { User } from "@/features/chat";

export type FundTransaction = {
  _id?: string;
  fundAmount: number;
  withdrawMethod: WithdrawMethod;
  fundAttachment?: string;
  status: "pending" | "success" | "failed";
  createdAt?: string;
  user?: User;
  ticketNumber?: string;
  contract: string;
};

export type WithdrawMethod = {
  _id: string;
  method: string;
  number: string;
  name: string;
  status: string;
  default: boolean;
  isDeleted: boolean;
};

// {
//           "_id": "6883a8564b407b514d6821a2",
//           "fundAmount": 20,
//           "status": "success",
//           "createdAt": "2025-07-25T15:52:54.780Z",
//           "user": {
//               "_id": "680cb6b9e479a12fb2e5f9c1",
//               "name": "Omar Foud",
//               "username": "omarmedhat1",
//               "email": "omar.medhatqc@gmail.com",
//               "profileImage": "https://duvdu-s3.s3.eu-central-1.amazonaws.com/auth/1746294939310-c7955a0e.jpg",
//               "phoneNumber": {
//                   "number": "01002906678",
//                   "key": null
//               }
//           },
//           "createdBy": {
//               "_id": "662b93104566c8d2f8ed6aea",
//               "name": "Metooo Khaled",
//               "username": "metoooooo",
//               "profileImage": "https://duvdu-s3.s3.eu-central-1.amazonaws.com/defaults/1753294917666-12fa31d0.jpg",
//               "phoneNumber": {
//                   "number": "01067630132"
//               }
//           },
//           "fundAttachment": "https://duvdu-s3.s3.eu-central-1.amazonaws.com/transactions/1753458773929-9b1452a8.pdf",
//           "withdrawMethod": {
//               "_id": "684eccee772365c582ec04ab",
//               "method": "bank",
//               "number": "4524343452764549",
//               "name": "Ahmed BM",
//               "status": "active",
//               "default": true,
//               "isDeleted": false
//           },
//           "ticketNumber": "TKT453790"
//       },
