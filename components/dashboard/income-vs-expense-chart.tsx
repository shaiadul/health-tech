"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MonthlyComparison } from "@/types/analytics"
import { formatCurrency, formatCompactCurrency } from "@/lib/formatters"

interface IncomeVsExpenseChartProps {
  data: MonthlyComparison[]
}

export function IncomeVsExpenseChart({ data }: IncomeVsExpenseChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  // Find max value for scaling
  const maxValue = Math.max(
    ...data.flatMap((d) => [d.income, d.expenses]),
    1000000
  )

  return (
    <Card className="border border-border/80">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold">Cashflow Velocity</CardTitle>
            <CardDescription className="text-xs">
              Monthly Inflow vs Outflow Comparison (USD)
            </CardDescription>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-primary" />
              <span className="text-muted-foreground font-medium">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-muted-foreground/30" />
              <span className="text-muted-foreground font-medium">Expenses</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Bars Container */}
        <div className="h-56 flex items-end gap-3 sm:gap-6 pt-6 pb-2 border-b border-border/60">
          {data.map((item, idx) => {
            const incomeHeight = (item.income / maxValue) * 100
            const expenseHeight = (item.expenses / maxValue) * 100
            const isHovered = hoveredIndex === idx

            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-14 z-20 bg-popover text-popover-foreground border border-border px-2.5 py-1.5 rounded-md shadow-md text-[11px] whitespace-nowrap pointer-events-none animate-in fade-in-50 zoom-in-95">
                    <p className="font-semibold">{item.month}</p>
                    <p className="text-success">In: {formatCurrency(item.income)}</p>
                    <p className="text-destructive">Out: {formatCurrency(item.expenses)}</p>
                  </div>
                )}

                {/* Bars Pair */}
                <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                  {/* Income bar */}
                  <div
                    style={{ height: `${incomeHeight}%` }}
                    className="w-full max-w-[18px] bg-primary rounded-t-sm transition-all duration-300 group-hover:brightness-110"
                  />
                  {/* Expense bar */}
                  <div
                    style={{ height: `${expenseHeight}%` }}
                    className="w-full max-w-[18px] bg-muted-foreground/30 rounded-t-sm transition-all duration-300 group-hover:bg-muted-foreground/50"
                  />
                </div>

                {/* Month label */}
                <span className="text-[11px] text-muted-foreground font-medium mt-2 block truncate">
                  {item.month}
                </span>
              </div>
            )
          })}
        </div>

        {/* Footer stat */}
        <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground">
          <span>Net Surplus (Trailing 6M)</span>
          <span className="font-semibold text-foreground font-mono">
            {formatCompactCurrency(
              data.reduce((acc, curr) => acc + curr.netSavings, 0)
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
