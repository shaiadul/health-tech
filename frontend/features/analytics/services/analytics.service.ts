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
import { getAnalyticsSummaryAction } from "@/lib/actions"

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
    try {
      const res = await getAnalyticsSummaryAction()
      if (res.success && res.data) {
        return {
          ...MOCK_ANALYTICS_SUMMARY,
          ...res.data,
        }
      }
    } catch {
      // Fallback
    }
    return { ...MOCK_ANALYTICS_SUMMARY }
  },
}
