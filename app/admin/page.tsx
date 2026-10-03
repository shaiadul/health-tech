import { AppointmentService } from "@/features/appointments/services/appointment.service"
import { SpecialistService } from "@/features/specialists/services/specialist.service"
import { ClinicAdminView } from "@/features/admin/components/clinic-admin-view"
import { MarketingNavbar } from "@/components/marketing/navbar"
import { MarketingFooter } from "@/components/marketing/footer"

export const metadata = {
  title: "Hospital & Clinic Admin Management | MedPulse",
  description: "Live outpatient appointment queue, patient triage, and doctor availability management.",
}

export default async function AdminPage() {
  const [{ upcoming, past }, doctors] = await Promise.all([
    AppointmentService.getUserAppointments(),
    SpecialistService.getAll(),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MarketingNavbar />
      <main className="flex-1 px-4 sm:px-6 lg:px-8">
        <ClinicAdminView
          initialAppointments={[...upcoming, ...past]}
          doctors={doctors}
        />
      </main>
      <MarketingFooter />
    </div>
  )
}
