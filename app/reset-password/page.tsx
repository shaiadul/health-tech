import { ResetPasswordForm } from "@/features/auth/components/reset-password-form"

export const metadata = {
  title: "Reset Credential | Aegis Financial",
  description: "Configure new terminal password.",
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <ResetPasswordForm />
    </div>
  )
}
