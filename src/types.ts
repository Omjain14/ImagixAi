export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  role: "user" | "admin";
  createdAt?: string;
}

export interface PaymentRequest {
  id: string;
  userId: string;
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
  id: string;
  userId: string;
  amount: number;
  type: "added" | "deducted";
  reason: string;
  createdAt: string;
}
