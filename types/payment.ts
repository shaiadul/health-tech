export interface Recipient {
  id: string
  name: string
  email: string
  avatar?: string
  accountNumberMasked: string
  bankName: string
  category: "vendor" | "team" | "contractor" | "utility"
}

export type PaymentMethodType = "ach" | "wire" | "instant"

export interface PaymentSubmission {
  fromAccountId: string
  recipientId: string
  recipientName: string
  recipientEmail?: string
  amount: number // in minor units
  note?: string
  paymentMethod: PaymentMethodType
  scheduledDate?: string
  category?: string
}

export interface PaymentReceipt {
  transactionId: string
  timestamp: string
  amount: number
  fee: number
  recipientName: string
  fromAccountName: string
  referenceNumber: string
  status: "completed" | "processing"
}
