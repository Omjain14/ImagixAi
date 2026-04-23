export interface User {
  id: number;
  name: string;
  email: string;
  credits: number;
  role: "user" | "admin";
  createdAt?: string;
}

export interface PaymentRequest {
  id: number;
  userId: number;
  plan: string;
  amount: number;
  utrCode: string;
  date: string;
  note?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface CreditHistory {
  id: number;
  userId: number;
  amount: number;
  type: "added" | "deducted";
  reason: string;
  createdAt: string;
}
