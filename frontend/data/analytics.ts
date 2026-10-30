import {
  MonthlyComparison,
  CategorySpending,
  CashflowTrendPoint,
  AnalyticsSummary,
} from "@/types/analytics"
import { Recipient } from "@/types/payment"

export const MOCK_MONTHLY_COMPARISON: MonthlyComparison[] = [
  { month: "May", income: 38000000, expenses: 14500000, netSavings: 23500000 },
  { month: "Jun", income: 42000000, expenses: 16800000, netSavings: 25200000 },
  { month: "Jul", income: 49500000, expenses: 19200000, netSavings: 30300000 },
  { month: "Aug", income: 54000000, expenses: 21500000, netSavings: 32500000 },
  { month: "Sep", income: 66097000, expenses: 24591200, netSavings: 41505800 },
  { month: "Oct (MTD)", income: 59797000, expenses: 18452000, netSavings: 41345000 },
]

export const MOCK_CATEGORY_SPENDING: CategorySpending[] = [
  {
    category: "Payroll & Operations",
    amount: 8850000,
    percentage: 42.5,
    color: "var(--chart-1)",
    transactionCount: 4,
  },
  {
    category: "Cloud & Infrastructure",
    amount: 2469200,
    percentage: 23.4,
    color: "var(--chart-2)",
    transactionCount: 8,
  },
  {
    category: "Professional Services",
    amount: 2250000,
    percentage: 16.2,
    color: "var(--chart-3)",
    transactionCount: 3,
  },
  {
    category: "Office & Facilities",
    amount: 1730000,
    percentage: 10.8,
    color: "var(--chart-4)",
    transactionCount: 2,
  },
  {
    category: "Software & SaaS",
    amount: 1260000,
    percentage: 7.1,
    color: "var(--chart-5)",
    transactionCount: 12,
  },
]

export const MOCK_CASHFLOW_TRENDS: CashflowTrendPoint[] = [
  { date: "Sep 01", inflow: 12000000, outflow: 4500000, netBalance: 215000000 },
  { date: "Sep 07", inflow: 8500000, outflow: 3200000, netBalance: 220300000 },
  { date: "Sep 14", inflow: 15400000, outflow: 6100000, netBalance: 229600000 },
  { date: "Sep 21", inflow: 22800000, outflow: 5800000, netBalance: 246600000 },
  { date: "Sep 28", inflow: 18200000, outflow: 4900000, netBalance: 259900000 },
  { date: "Oct 02", inflow: 25000000, outflow: 4200000, netBalance: 280700000 },
]

export const MOCK_ANALYTICS_SUMMARY: AnalyticsSummary = {
  totalIncomeMonth: 66097000, // $660,970.00
  totalExpenseMonth: 24591200, // $245,912.00
  savingsRate: 0.628, // 62.8%
  monthlyGrowthRate: 0.184, // +18.4%
  topExpenseCategory: "Payroll & Operations",
  averageDailySpend: 819706, // $8,197.06/day
}

export const MOCK_RECIPIENTS: Recipient[] = [
  {
    id: "rec_aws_01",
    name: "Amazon Web Services Inc.",
    email: "billing@aws.amazon.com",
    accountNumberMasked: "•••• 9021",
    bankName: "Citibank N.A.",
    category: "vendor",
  },
  {
    id: "rec_stripe_02",
    name: "Stripe Operations US",
    email: "treasury@stripe.com",
    accountNumberMasked: "•••• 3391",
    bankName: "Wells Fargo Bank",
    category: "vendor",
  },
  {
    id: "rec_lw_03",
    name: "Latham & Watkins LLP",
    email: "finance@lw.com",
    accountNumberMasked: "•••• 8820",
    bankName: "Bank of America",
    category: "vendor",
  },
  {
    id: "rec_wework_04",
    name: "WeWork Companies LLC",
    email: "leases@wework.com",
    accountNumberMasked: "•••• 1104",
    bankName: "JPMorgan Chase",
    category: "utility",
  },
  {
    id: "rec_dev_05",
    name: "Marcus Aurelius (Staff Eng Lead)",
    email: "m.aurelius@vanguard-cap.io",
    accountNumberMasked: "•••• 4429",
    bankName: "Chase Private Client",
    category: "team",
  },
  {
    id: "rec_audit_06",
    name: "KPMG Advisory US",
    email: "invoices@kpmg.com",
    accountNumberMasked: "•••• 7712",
    bankName: "BNY Mellon",
    category: "contractor",
  },
]
