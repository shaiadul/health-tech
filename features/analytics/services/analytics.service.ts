import {
  MOCK_MONTHLY_COMPARISON,
  MOCK_CATEGORY_SPENDING,
  MOCK_CASHFLOW_TRENDS,
  MOCK_ANALYTICS_SUMMARY,
} from "@/data/analytics"
import {
  MonthlyComparison,
  CategorySpending,
  CashflowTrendPoint,
  AnalyticsSummary,
} from "@/types/analytics"

export const AnalyticsService = {
  async getMonthlyComparison(): Promise<MonthlyComparison[]> {
    return [...MOCK_MONTHLY_COMPARISON]
  },

  async getCategorySpending(): Promise<CategorySpending[]> {
    return [...MOCK_CATEGORY_SPENDING]
  },

  async getCashflowTrends(): Promise<CashflowTrendPoint[]> {
    return [...MOCK_CASHFLOW_TRENDS]
  },

  async getSummary(): Promise<AnalyticsSummary> {
    return { ...MOCK_ANALYTICS_SUMMARY }
  },
}
