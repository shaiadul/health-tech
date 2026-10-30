import { z } from "zod"

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required"),
  role: z.string().min(2, "Role is required"),
  organization: z.string().min(2, "Organization name is required"),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

export const securityPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  })

export type SecurityPasswordFormValues = z.infer<typeof securityPasswordSchema>

export const notificationSettingsSchema = z.object({
  transactionAlerts: z.boolean(),
  largeTransferAlerts: z.boolean(),
  securityAlerts: z.boolean(),
  weeklySummaryDigest: z.boolean(),
  marketingUpdates: z.boolean(),
})

export type NotificationSettingsFormValues = z.infer<
  typeof notificationSettingsSchema
>

export const preferenceSettingsSchema = z.object({
  currency: z.enum(["USD", "EUR", "GBP", "SGD"]),
  language: z.enum(["en-US", "en-GB", "es-ES", "de-DE", "ja-JP"]),
  theme: z.enum(["system", "light", "dark"]),
})

export type PreferenceSettingsFormValues = z.infer<
  typeof preferenceSettingsSchema
>
