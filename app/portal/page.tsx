import * as React from "react"
import { AppointmentService } from "@/features/appointments/services/appointment.service"
import { PortalView } from "@/features/appointments/components/portal-view"
import { MarketingNavbar } from "@/components/marketing/navbar"
import { MarketingFooter } from "@/components/marketing/footer"
import { PageContainer } from "@/components/layout/page-container"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Clinical Portal | MedPulse Hospital & Clinic",
  description:
    "Patient care portal, physician workstation, and clinic organizer triage operations.",
}

function PortalSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <Skeleton className="h-20 w-full rounded-3xl" />
      <Skeleton className="h-64 w-full rounded-3xl" />
      <Skeleton className="h-40 w-full rounded-2xl" />
    </div>
  )
}

export default async function CustomerPortalPage() {
  const { upcoming, past } = await AppointmentService.getUserAppointments()

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MarketingNavbar />
      <main className="flex-1">
        <PageContainer maxWidth="6xl" paddingY="compact">
          <React.Suspense fallback={<PortalSkeleton />}>
            <PortalView initialUpcoming={upcoming} initialPast={past} />
          </React.Suspense>
        </PageContainer>
      </main>
      <MarketingFooter />
    </div>
  )
}
