import * as React from "react"
import { LoginForm } from "@/features/auth/components/login-form"
import { MarketingNavbar } from "@/components/marketing/navbar"
import { MarketingFooter } from "@/components/marketing/footer"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Clinical Staff Sign In | MedPulse Hospital Management & Doctor Portal",
  description:
    "Authorized sign-in terminal for MedPulse Hospital Management and Attending Physicians.",
}

function LoginSkeleton() {
  return (
    <div className="w-full max-w-xl h-[600px] rounded-3xl bg-card border border-border animate-pulse p-8 space-y-6">
      <Skeleton className="h-12 w-48 mx-auto" />
      <Skeleton className="h-8 w-64 mx-auto" />
      <Skeleton className="h-16 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MarketingNavbar />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-muted/20">
        <React.Suspense fallback={<LoginSkeleton />}>
          <LoginForm />
        </React.Suspense>
      </main>
      <MarketingFooter />
    </div>
  )
}
