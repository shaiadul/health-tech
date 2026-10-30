import { ResetPasswordForm } from "@/features/auth/components/reset-password-form"
import { MarketingNavbar } from "@/components/marketing/navbar"
import { MarketingFooter } from "@/components/marketing/footer"

export const metadata = {
  title: "Reset Credential | MedPulse Health",
  description: "Configure new clinical account password.",
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MarketingNavbar />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-muted/20">
        <ResetPasswordForm />
      </main>
      <MarketingFooter />
    </div>
  )
}
