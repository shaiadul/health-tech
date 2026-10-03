import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form"

export const metadata = {
  title: "Recover Credential | MedPulse Health",
  description: "Recover access to your clinical account credentials.",
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <ForgotPasswordForm />
    </div>
  )
}
