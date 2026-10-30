"use client"

import * as React from "react"
import { CashflowTrendChart } from "./cashflow-trend-chart"
import { TopCategoriesBreakdown } from "./top-categories-breakdown"
import { SavingsTrendChart } from "./savings-trend-chart"
import { IncomeVsExpenseChart } from "@/components/dashboard/income-vs-expense-chart"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MonthlyComparison,
  CategorySpending,
  CashflowTrendPoint,
  AnalyticsSummary,
} from "@/types/analytics"
import { formatCurrency, formatPercentage } from "@/lib/formatters"
import {
  TrendingUp,
  TrendingDown,
  Percent,
  Calendar,
  Download,
  Filter,
} from "lucide-react"

interface AnalyticsViewProps {
  monthlyComparison: MonthlyComparison[]
  categorySpending: CategorySpending[]
  cashflowTrends: CashflowTrendPoint[]
  summary: AnalyticsSummary
}

export function AnalyticsView({
  monthlyComparison,
  categorySpending,
  cashflowTrends,
  summary,
}: AnalyticsViewProps) {
  const [timeframe, setTimeframe] = React.useState<"30d" | "90d" | "1y">("30d")

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Financial & Cashflow Analytics
          </h2>
          <p className="text-xs text-muted-foreground">
            Institutional cashflow velocity, burn rate predictability, and cost center attribution
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Timeframe pills */}
          <div className="flex items-center rounded-lg bg-muted p-1 text-xs">
            <Button
              variant={timeframe === "30d" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe("30d")}
              className="h-7 px-3 text-xs"
            >
              30 Days
            </Button>
            <Button
              variant={timeframe === "90d" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe("90d")}
              className="h-7 px-3 text-xs"
            >
              Quarter
            </Button>
            <Button
              variant={timeframe === "1y" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe("1y")}
              className="h-7 px-3 text-xs"
            >
              YTD
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Exporting CFO Analytics Report PDF...")}
            className="h-9 text-xs gap-1.5 border-border"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground text-xs uppercase mb-1">
              <span>Gross Inflow (Month)</span>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {formatCurrency(summary.totalIncomeMonth)}
            </div>
            <span className="text-[11px] text-success font-medium flex items-center gap-1 mt-1">
              +{formatPercentage(summary.monthlyGrowthRate, false)} vs trailing 30d
            </span>
          </CardContent>
        </Card>

        <Card className="border border-border/80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground text-xs uppercase mb-1">
              <span>Operational Burn</span>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {formatCurrency(summary.totalExpenseMonth)}
            </div>
            <span className="text-[11px] text-muted-foreground mt-1 block">
              Avg daily run rate: {formatCurrency(summary.averageDailySpend)}
            </span>
          </CardContent>
        </Card>

        <Card className="border border-border/80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground text-xs uppercase mb-1">
              <span>Capital Retention Rate</span>
              <Percent className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {(summary.savingsRate * 100).toFixed(1)}%
            </div>
            <span className="text-[11px] text-success font-medium mt-1 block">
              Top decile liquidity retention
            </span>
          </CardContent>
        </Card>

        <Card className="border border-border/80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground text-xs uppercase mb-1">
              <span>Projected Cash Runway</span>
              <Calendar className="h-4 w-4 text-info" />
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">
              38.4 Mos
            </div>
            <span className="text-[11px] text-muted-foreground mt-1 block">
              Based on net burn &amp; T-Bills
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Main Liquidity Trajectory Chart */}
      <CashflowTrendChart data={cashflowTrends} />

      {/* Secondary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeVsExpenseChart data={monthlyComparison} />
        <TopCategoriesBreakdown categories={categorySpending} />
      </div>

      {/* Capital Retention Trend */}
      <SavingsTrendChart data={monthlyComparison} />
    </div>
  )
}
