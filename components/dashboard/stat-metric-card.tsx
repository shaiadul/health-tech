import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, formatPercentage } from "@/lib/formatters"
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatMetricCardProps {
  title: string
  amountInMinorUnits: number
  changeRate?: number
  isPositiveGood?: boolean
  icon: LucideIcon
  description?: string
}

export function StatMetricCard({
  title,
  amountInMinorUnits,
  changeRate,
  isPositiveGood = true,
  icon: Icon,
  description,
}: StatMetricCardProps) {
  const isPositive = (changeRate ?? 0) >= 0
  const isSuccessState = isPositiveGood ? isPositive : !isPositive

  return (
    <Card className="border border-border/70 hover:border-border transition-all">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </span>
          <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-foreground font-mono">
            {formatCurrency(amountInMinorUnits)}
          </div>

          <div className="flex items-center gap-1.5 mt-1 text-xs">
            {changeRate !== undefined && (
              <span
                className={cn(
                  "flex items-center font-semibold font-mono",
                  isSuccessState ? "text-success" : "text-destructive"
                )}
              >
                {isPositive ? (
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-0.5" />
                )}
                {formatPercentage(changeRate)}
              </span>
            )}
            <span className="text-muted-foreground truncate">
              {description || "vs last month"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
