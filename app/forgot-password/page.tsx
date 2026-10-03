import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form"

export const metadata = {
  title: "Recover Credential | Aegis Financial",
  description: "Initiate hardware cryptographic challenge recovery.",
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <ForgotPasswordForm />
    </div>
  )
}
