import { AppointmentService } from "@/features/appointments/services/appointment.service"
import { SpecialistService } from "@/features/specialists/services/specialist.service"
import { DashboardRoleView } from "@/features/admin/components/dashboard-role-view"

export const metadata = {
  title: "Clinical Operations & Physician Workstation | MedPulse",
  description:
    "Role-based clinical dashboard for MedPulse Hospital Management and Attending Physicians.",
}

export default async function DashboardPage() {
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
