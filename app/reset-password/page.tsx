import { ResetPasswordForm } from "@/features/auth/components/reset-password-form"

export const metadata = {
  title: "Reset Credential | MedPulse Health",
  description: "Configure new clinical account password.",
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <ResetPasswordForm />
    </div>
  )
}
