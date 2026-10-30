import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form"
import { MarketingNavbar } from "@/components/marketing/navbar"
import { MarketingFooter } from "@/components/marketing/footer"

export const metadata = {
  title: "Recover Credential | MedPulse Health",
  description: "Recover access to your clinical account credentials.",
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MarketingNavbar />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-muted/20">
        <ForgotPasswordForm />
      </main>
      <MarketingFooter />
    </div>
  )
}
