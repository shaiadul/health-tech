import { AppointmentService } from "@/features/appointments/services/appointment.service"
import { PortalView } from "@/features/appointments/components/portal-view"
import { MarketingNavbar } from "@/components/marketing/navbar"
import { MarketingFooter } from "@/components/marketing/footer"

export const metadata = {
  title: "Patient Care Portal | MedPulse Hospital & Clinic",
  description: "View upcoming medical consultations, access telehealth video rooms, reschedule appointments, and view clinical history.",
}

export default async function CustomerPortalPage() {
  const { upcoming, past } = await AppointmentService.getUserAppointments()

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MarketingNavbar />
      <main className="flex-1 py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <PortalView initialUpcoming={upcoming} initialPast={past} />
      </main>
      <MarketingFooter />
    </div>
  )
}
