import { z } from "zod"

export const quickLeadSchema = z.object({
  fullName: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  serviceInterest: z.string().optional(),
})

export type QuickLeadFormValues = z.infer<typeof quickLeadSchema>

export const newsletterSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
})

export type NewsletterFormValues = z.infer<typeof newsletterSchema>
