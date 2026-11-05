import { AppointmentService } from "@/features/appointments/services/appointment.service"
import { SpecialistService } from "@/features/specialists/services/specialist.service"
import { DashboardRoleView } from "@/features/admin/components/dashboard-role-view"

export const metadata = {
  title: "Outpatient Appointment Queue & Clinical Ledger | MedPulse",
  description:
    "Live outpatient consultation records, patient triage ledger, and attending physician schedule.",
}

export default async function TransactionsPage() {
  const [{ upcoming, past }, doctors] = await Promise.all([
    AppointmentService.getUserAppointments(),
    SpecialistService.getAll(),
  ])

  return (
    <div className="space-y-6">
      <DashboardRoleView
        initialAppointments={[...upcoming, ...past]}
        doctors={doctors}
      />
    </div>
  )
}
