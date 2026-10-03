import * as React from "react"
import { ServiceService } from "@/features/services/services/service.service"
import { SpecialistService } from "@/features/specialists/services/specialist.service"
import { AppointmentService } from "@/features/appointments/services/appointment.service"
import { BookingFlow } from "@/features/appointments/components/booking-flow"
import { MarketingNavbar } from "@/components/marketing/navbar"
import { MarketingFooter } from "@/components/marketing/footer"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Book a Consultation | Finora",
  description: "Schedule a 1-on-1 private advisory consultation with a verified fiduciary specialist.",
}

function BookingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Skeleton className="h-10 w-64 mx-auto" />
      <Skeleton className="h-4 w-96 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default async function BookAppointmentPage() {
  const [services, specialists, initialDates] = await Promise.all([
    ServiceService.getAll(),
    SpecialistService.getAll(),
    AppointmentService.getAvailableDates(),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MarketingNavbar />
      <main className="flex-1 py-10 md:py-16 px-4 sm:px-6 lg:px-8">
        <React.Suspense fallback={<BookingSkeleton />}>
          <BookingFlow
            services={services}
            specialists={specialists}
            initialDates={initialDates}
          />
        </React.Suspense>
      </main>
      <MarketingFooter />
    </div>
  )
}
