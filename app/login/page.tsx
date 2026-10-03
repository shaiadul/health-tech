import { LoginForm } from "@/features/auth/components/login-form"

export const metadata = {
  title: "Sign In | Aegis Financial",
  description: "Authenticate to your enterprise treasury terminal.",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <LoginForm />
    </div>
  )
}
