import { AppointmentService } from "@/features/appointments/services/appointment.service"
import { SpecialistService } from "@/features/specialists/services/specialist.service"
import { ClinicAdminView } from "@/features/admin/components/clinic-admin-view"

export const metadata = {
  title: "Hospital & Clinic Admin Operations | MedPulse",
  description: "Live outpatient appointment queue, patient triage, and doctor availability management.",
}

export default async function DashboardPage() {
  const [{ upcoming, past }, doctors] = await Promise.all([
    AppointmentService.getUserAppointments(),
    SpecialistService.getAll(),
  ])

  return (
    <div className="space-y-6">
      <ClinicAdminView
        initialAppointments={[...upcoming, ...past]}
        doctors={doctors}
      />
    </div>
  )
}
