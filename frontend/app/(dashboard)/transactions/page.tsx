import { AppointmentService } from "@/features/appointments/services/appointment.service"
import { SpecialistService } from "@/features/specialists/services/specialist.service"
import { ClinicAdminView } from "@/features/admin/components/clinic-admin-view"

export const metadata = {
  title: "Outpatient Appointment Queue | MedPulse Hospital Admin",
  description: "Live outpatient consultation records, patient triage ledger, and room scheduling.",
}

export default async function TransactionsPage() {
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
