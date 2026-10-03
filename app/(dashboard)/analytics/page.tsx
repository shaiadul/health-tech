import { ClinicAnalyticsView } from "@/features/admin/components/clinic-analytics-view"

export const metadata = {
  title: "Clinical Department Analytics | MedPulse Admin",
  description: "Audited patient throughput trends, tele-consultation ratios, wait times, and clinical quality metrics.",
}

export default async function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <ClinicAnalyticsView />
    </div>
  )
}
