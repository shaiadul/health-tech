export interface InsightItem {
  id: string
  title: string
  summary: string
  readTime: string
  category: string
  date: string
}

export const INSIGHTS: InsightItem[] = [
  {
    id: "insight-01",
    title: "How to build a financial plan that actually works",
    summary: "Why traditional 60/40 asset allocations fail modern liquidity needs, and how cashflow-first engineering protects downside risk.",
    readTime: "5 min read",
    category: "Wealth Architecture",
    date: "October 2026",
  },
  {
    id: "insight-02",
    title: "What to consider before your next investment decision",
    summary: "Five non-negotiable stress tests to run against private equity, angel checks, and index allocations before committing capital.",
    readTime: "7 min read",
    category: "Portfolio Strategy",
    date: "September 2026",
  },
  {
    id: "insight-03",
    title: "Tax-loss harvesting: Turning volatility into long-term efficiency",
    summary: "How proactive quarterly rebalancing converts unrealized pullbacks into permanent tax shields without losing market exposure.",
    readTime: "4 min read",
    category: "Tax Optimization",
    date: "September 2026",
  },
  {
    id: "insight-04",
    title: "Executive compensation & liquidity event planning",
    summary: "Navigating ISO vs. NSO exercise schedules, 83(b) elections, and secondary market liquidity before your company reaches public markets.",
    readTime: "6 min read",
    category: "Executive Strategy",
    date: "August 2026",
  },
]
