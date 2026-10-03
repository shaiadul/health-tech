import { AccountService } from "@/features/accounts/services/account.service"
import { TransactionService } from "@/features/transactions/services/transaction.service"
import { AnalyticsService } from "@/features/analytics/services/analytics.service"
import { DashboardClientWrapper } from "@/components/dashboard/dashboard-client-wrapper"

export const metadata = {
  title: "Dashboard | Aegis Financial",
  description: "Enterprise treasury liquidity overview and real-time ledger metrics.",
}

export default async function DashboardPage() {
  // Fetch data in parallel on the server
  const [
    accounts,
    recentTransactions,
    monthlyComparison,
    categorySpending,
    summary,
    totalBalances,
  ] = await Promise.all([
    AccountService.getAll(),
    TransactionService.getRecent(5),
    AnalyticsService.getMonthlyComparison(),
    AnalyticsService.getCategorySpending(),
    AnalyticsService.getSummary(),
    AccountService.getTotalBalances(),
  ])

  return (
    <DashboardClientWrapper
      accounts={accounts}
      recentTransactions={recentTransactions}
      monthlyComparison={monthlyComparison}
      categorySpending={categorySpending}
      summary={summary}
      totalBalances={totalBalances}
    />
  )
}
