import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CategorySpending } from "@/types/analytics"
import { formatCurrency } from "@/lib/formatters"

interface SpendingChartProps {
  categories: CategorySpending[]
}

export function SpendingChart({ categories }: SpendingChartProps) {
  const total = categories.reduce((sum, c) => sum + c.amount, 0)

  return (
    <Card className="border border-border/80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Expense Allocation</CardTitle>
            <CardDescription className="text-xs">
              Spend distribution across operating verticals
            </CardDescription>
          </div>
          <span className="text-xs font-mono font-semibold text-foreground">
            {formatCurrency(total)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Multi-segment progress bar */}
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
          {categories.map((cat, i) => (
            <div
              key={cat.category}
              style={{
                width: `${cat.percentage}%`,
                opacity: 1 - i * 0.15,
              }}
              className="h-full bg-primary first:rounded-l-full last:rounded-r-full"
              title={`${cat.category}: ${cat.percentage}%`}
            />
          ))}
        </div>

        {/* Category list breakdown */}
        <div className="space-y-2.5 pt-1">
          {categories.map((cat) => (
            <div
              key={cat.category}
              className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0"
            >
              <div className="flex items-center gap-2 overflow-hidden pr-2">
                <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                <span className="font-medium text-foreground truncate">
                  {cat.category}
                </span>
                <span className="text-[11px] text-muted-foreground hidden sm:inline">
                  ({cat.transactionCount} txs)
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono font-medium text-foreground">
                  {formatCurrency(cat.amount)}
                </span>
                <span className="w-10 text-right text-muted-foreground font-mono text-[11px]">
                  {cat.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
