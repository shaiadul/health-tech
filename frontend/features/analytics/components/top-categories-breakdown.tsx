import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CategorySpending } from "@/types/analytics"
import { formatCurrency } from "@/lib/formatters"
import { PieChart, TrendingDown, ArrowUpRight } from "lucide-react"

interface TopCategoriesBreakdownProps {
  categories: CategorySpending[]
}

export function TopCategoriesBreakdown({ categories }: TopCategoriesBreakdownProps) {
  const sorted = [...categories].sort((a, b) => b.amount - a.amount)

  return (
    <Card className="border border-border/80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <PieChart className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Top Cost Centers</CardTitle>
              <CardDescription className="text-xs">
                Audited monthly expenditure verticals
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px]">
            {categories.length} Categories
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {sorted.map((cat, index) => {
          const avgPerTx = Math.round(cat.amount / Math.max(1, cat.transactionCount))

          return (
            <div
              key={cat.category}
              className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-2 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    #{index + 1}
                  </span>
                  <span className="font-semibold text-foreground">{cat.category}</span>
                </div>
                <span className="font-mono font-bold text-sm text-foreground">
                  {formatCurrency(cat.amount)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  style={{ width: `${cat.percentage}%` }}
                  className="h-full bg-primary rounded-full"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>
                  {cat.transactionCount} transactions (avg {formatCurrency(avgPerTx)}/tx)
                </span>
                <span className="font-mono font-medium text-foreground">
                  {cat.percentage.toFixed(1)}% of total
                </span>
              </div>
            </div>
          )
        })}

        <div className="p-3 bg-muted/30 border border-border/60 rounded-lg flex items-start gap-2.5 text-xs text-muted-foreground">
          <TrendingDown className="h-4 w-4 text-success shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-foreground">Optimization Insight:</strong> Cloud &
            infrastructure spending dropped 3.8% MoM following auto-scaling optimization on AWS us-east GPU clusters.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
