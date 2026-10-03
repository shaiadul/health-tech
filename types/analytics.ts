export interface MonthlyComparison {
  month: string
  income: number // in minor units
  expenses: number // in minor units
  netSavings: number // in minor units
}

export interface CategorySpending {
  category: string
  amount: number // in minor units
  percentage: number
  color: string
  transactionCount: number
}

export interface CashflowTrendPoint {
  date: string
  inflow: number
  outflow: number
  netBalance: number
}

export interface AnalyticsSummary {
  totalIncomeMonth: number
  totalExpenseMonth: number
  savingsRate: number
  monthlyGrowthRate: number
  topExpenseCategory: string
  averageDailySpend: number
}
