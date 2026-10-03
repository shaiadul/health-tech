"use client"

import * as React from "react"
import { BalanceCard } from "@/components/dashboard/balance-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { StatMetricCard } from "@/components/dashboard/stat-metric-card"
import { IncomeVsExpenseChart } from "@/components/dashboard/income-vs-expense-chart"
import { SpendingChart } from "@/components/dashboard/spending-chart"
import { TransactionList } from "@/components/dashboard/transaction-list"
import { AccountSummary } from "@/components/dashboard/account-summary"
import { TransactionDetailDialog } from "@/features/transactions/components/transaction-detail-dialog"
import { QuickActionDialogs, QuickActionType } from "@/components/layout/quick-action-dialogs"
import { BankAccount } from "@/types/account"
import { Transaction } from "@/types/transaction"
import {
  MonthlyComparison,
  CategorySpending,
  AnalyticsSummary,
} from "@/types/analytics"
import {
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  Hourglass,
} from "lucide-react"

interface DashboardClientWrapperProps {
  accounts: BankAccount[]
  recentTransactions: Transaction[]
  monthlyComparison: MonthlyComparison[]
  categorySpending: CategorySpending[]
  summary: AnalyticsSummary
  totalBalances: {
    netWorth: number
    totalAssets: number
    totalLiabilities: number
    totalAvailable: number
  }
}

export function DashboardClientWrapper({
  accounts,
  recentTransactions,
  monthlyComparison,
  categorySpending,
  summary,
  totalBalances,
}: DashboardClientWrapperProps) {
  const [selectedTx, setSelectedTx] = React.useState<Transaction | null>(null)
  const [activeAction, setActiveAction] = React.useState<QuickActionType>(null)

  return (
    <div className="space-y-6">
      {/* Top Banner: Liquidity Portfolio Card */}
      <BalanceCard
        totalBalance={totalBalances.netWorth}
        availableBalance={totalBalances.totalAvailable}
        growthRate={summary.monthlyGrowthRate}
        onQuickAction={(act) => setActiveAction(act)}
      />

      {/* 4 Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatMetricCard
          title="Monthly Inflow"
          amountInMinorUnits={summary.totalIncomeMonth}
          changeRate={0.142}
          isPositiveGood={true}
          icon={ArrowDownLeft}
          description="vs prior 30d"
        />
        <StatMetricCard
          title="Monthly Burn"
          amountInMinorUnits={summary.totalExpenseMonth}
          changeRate={-0.038}
          isPositiveGood={false}
          icon={ArrowUpRight}
          description="vs prior 30d"
        />
        <StatMetricCard
          title="Net Cash Addition"
          amountInMinorUnits={summary.totalIncomeMonth - summary.totalExpenseMonth}
          changeRate={0.21}
          isPositiveGood={true}
          icon={PiggyBank}
          description="capital retained"
        />
        <StatMetricCard
          title="Avg Daily Spend"
          amountInMinorUnits={summary.averageDailySpend}
          changeRate={-0.015}
          isPositiveGood={false}
          icon={Hourglass}
          description="normalized run-rate"
        />
      </div>

      {/* Quick Actions Strip */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
          Quick Operations
        </h2>
        <QuickActions onActionClick={(act) => setActiveAction(act)} />
      </div>

      {/* Two Column Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeVsExpenseChart data={monthlyComparison} />
        <SpendingChart categories={categorySpending} />
      </div>

      {/* Two Column: Recent Transactions & Account Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionList
          transactions={recentTransactions}
          onSelectTransaction={(tx) => setSelectedTx(tx)}
        />
        <AccountSummary accounts={accounts} />
      </div>

      {/* Transaction Detail Dialog */}
      <TransactionDetailDialog
        transaction={selectedTx}
        open={!!selectedTx}
        onClose={() => setSelectedTx(null)}
      />

      {/* Action Dialog */}
      <QuickActionDialogs
        action={activeAction}
        onClose={() => setActiveAction(null)}
      />
    </div>
  )
}
