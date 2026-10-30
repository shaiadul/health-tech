import { SpecialistService } from "@/features/specialists/services/specialist.service"
import { PhysiciansRosterView } from "@/features/admin/components/physicians-roster-view"

export const metadata = {
  title: "Physician Staff & Specialists Roster | MedPulse Admin",
  description: "Board-certified medical specialists, duty shift statuses, and clinic room allocation.",
}

export default async function AccountsPage() {
  const doctors = await SpecialistService.getAll()

  return (
    <div className="space-y-6">
      <PhysiciansRosterView doctors={doctors} />
    </div>
  )
}
