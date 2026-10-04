import { z } from "zod"

export const customerInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address for your calendar invite"),
  phone: z.string().min(8, "Please enter a valid telephone number"),
  contactMethod: z.enum(["video", "phone", "in_person", "email"]),
  reason: z.string().min(3, "Please briefly summarize your consultation objective"),
  additionalNotes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
  bookingFor: z.enum(["self", "dependent"]).optional(),
  insuranceType: z.enum(["commercial", "medicare", "self_pay"]).optional(),
  preferredLanguage: z.string().optional(),
})

export type CustomerInfoFormValues = z.infer<typeof customerInfoSchema>

export const rescheduleSchema = z.object({
  date: z.string().min(1, "Please select a new date"),
  time: z.string().min(1, "Please select an available time slot"),
  reason: z.string().max(300).optional(),
})

export type RescheduleFormValues = z.infer<typeof rescheduleSchema>

export const cancellationSchema = z.object({
  reason: z.string().min(3, "Please let us know your reason for cancellation"),
})

export type CancellationFormValues = z.infer<typeof cancellationSchema>
