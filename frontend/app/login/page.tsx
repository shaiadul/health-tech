import { LoginForm } from "@/features/auth/components/login-form"
import { MarketingNavbar } from "@/components/marketing/navbar"
import { MarketingFooter } from "@/components/marketing/footer"

export const metadata = {
  title: "Role-Based Sign In | MedPulse Hospital & Healthcare Clinic",
  description:
    "Sign in to the MedPulse Patient Care Portal, Physician Workstation, or Clinic Organizer Dashboard.",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MarketingNavbar />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-muted/20">
        <LoginForm />
      </main>
      <MarketingFooter />
    </div>
  )
}
