import { z } from "zod"

export const paymentSchema = z.object({
  fromAccountId: z.string().min(1, "Please select a funding account"),
  recipientId: z.string().min(1, "Please choose a recipient"),
  recipientName: z.string().min(1, "Recipient name is required"),
  amount: z
    .number()
    .positive("Amount must be greater than $0.00")
    .max(10000000, "Single transfer limit exceeded ($10,000,000 max)"),
  paymentMethod: z.enum(["ach", "wire", "instant"]),
  note: z.string().max(200, "Reference note cannot exceed 200 characters").optional(),
  category: z.string().optional(),
})

export type PaymentFormValues = z.infer<typeof paymentSchema>

export const quickTransferSchema = z.object({
  fromAccountId: z.string().min(1, "Select source account"),
  toAccountId: z.string().min(1, "Select destination account"),
  amount: z.number().positive("Enter an amount greater than $0"),
  note: z.string().max(100).optional(),
})

export type QuickTransferFormValues = z.infer<typeof quickTransferSchema>
