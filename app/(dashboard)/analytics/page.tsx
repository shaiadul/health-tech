import { AnalyticsService } from "@/features/analytics/services/analytics.service"
import { AnalyticsView } from "@/features/analytics/components/analytics-view"

export const metadata = {
  title: "Analytics | Aegis Financial",
  description: "Audited financial trends, cashflow velocity, and cost attribution analytics.",
}

export default async function AnalyticsPage() {
  const [monthlyComparison, categorySpending, cashflowTrends, summary] =
    await Promise.all([
      AnalyticsService.getMonthlyComparison(),
      AnalyticsService.getCategorySpending(),
      AnalyticsService.getCashflowTrends(),
      AnalyticsService.getSummary(),
    ])

  return (
    <AnalyticsView
      monthlyComparison={monthlyComparison}
      categorySpending={categorySpending}
      cashflowTrends={cashflowTrends}
      summary={summary}
    />
  )
}
