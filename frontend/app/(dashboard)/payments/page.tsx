import { PatientAdmissionsView } from "@/features/admin/components/patient-admissions-view"

export const metadata = {
  title: "Patient Admissions & Consultation Billing | MedPulse Admin",
  description: "Real-time outpatient reception, insurance pre-authorization, triage urgency, and consultation invoices.",
}

export default async function PaymentsPage() {
  return (
    <div className="space-y-6">
      <PatientAdmissionsView />
    </div>
  )
}
