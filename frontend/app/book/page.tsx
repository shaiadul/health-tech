import * as React from "react"
import Link from "next/link"
import { ServiceService } from "@/features/services/services/service.service"
import { SpecialistService } from "@/features/specialists/services/specialist.service"
import { AppointmentService } from "@/features/appointments/services/appointment.service"
import { BookingFlow } from "@/features/appointments/components/booking-flow"
import { MarketingNavbar } from "@/components/marketing/navbar"
import { MarketingFooter } from "@/components/marketing/footer"
import { PageContainer } from "@/components/layout/page-container"
import { Skeleton } from "@/components/ui/skeleton"
import { ShieldCheck, Clock, Award, ChevronRight, Stethoscope } from "lucide-react"

export const metadata = {
  title: "Book a Doctor Appointment | MedPulse Hospital & Clinic",
  description:
    "Schedule an outpatient or telehealth consultation with board-certified physicians in Cardiology, Neurology, Pediatrics, Orthopedics, Dermatology, and Internal Medicine.",
}

function BookingSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
      <div className="space-y-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        <div className="lg:col-span-8 space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
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

      <main className="flex-1">
        <PageContainer maxWidth="6xl" paddingY="compact" className="space-y-6">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-border" />
            <Link href="/specialists" className="hover:text-foreground transition-colors">
              Specialists
            </Link>
            <ChevronRight className="h-3 w-3 text-border" />
            <span className="text-foreground font-medium">Book Appointment</span>
          </nav>

          {/* Trust Banner Strip */}
          <div className="hidden sm:grid grid-cols-3 gap-4 p-3.5 rounded-2xl bg-muted/30 border border-border/80 text-xs font-mono">
            <div className="flex items-center gap-2 text-foreground">
              <Award className="h-4 w-4 text-primary shrink-0" />
              <span>100% Board-Certified Faculty</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Real-Time Calendar Sync · $0 Due Today</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>HIPAA Compliant Encrypted Records</span>
            </div>
          </div>

          {/* Booking Flow Core */}
          <React.Suspense fallback={<BookingSkeleton />}>
            <BookingFlow
              services={services}
              specialists={specialists}
              initialDates={initialDates}
            />
          </React.Suspense>
        </PageContainer>
      </main>

      <MarketingFooter />
    </div>
  )
}
