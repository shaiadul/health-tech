import { z } from "zod"

export const addAccountSchema = z.object({
  name: z.string().min(3, "Account name must have at least 3 characters"),
  accountType: z.enum(["checking", "savings", "credit", "investment"]),
  institutionName: z.string().min(2, "Institution name is required"),
  initialDeposit: z.number().min(0, "Deposit cannot be negative"),
  routingNumber: z
    .string()
    .length(9, "Routing number must be exactly 9 digits")
    .regex(/^\d+$/, "Routing number must contain only numbers"),
  colorTheme: z.enum(["navy", "emerald", "slate", "indigo"]),
})

export type AddAccountFormValues = z.infer<typeof addAccountSchema>
