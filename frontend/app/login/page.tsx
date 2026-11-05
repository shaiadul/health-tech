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
    <div className="w-full max-w-md h-[520px] rounded-3xl bg-card border border-border animate-pulse p-7 space-y-5">
      <Skeleton className="h-10 w-44 mx-auto" />
      <Skeleton className="h-6 w-56 mx-auto" />
      <Skeleton className="h-12 w-full rounded-2xl" />
      <Skeleton className="h-11 w-full rounded-xl" />
      <Skeleton className="h-11 w-full rounded-xl" />
      <Skeleton className="h-11 w-full rounded-xl" />
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
