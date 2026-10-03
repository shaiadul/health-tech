"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MonthlyComparison } from "@/types/analytics"
import { formatCurrency } from "@/lib/formatters"
import { TrendingUp, PiggyBank } from "lucide-react"

interface SavingsTrendChartProps {
  data: MonthlyComparison[]
}

export function SavingsTrendChart({ data }: SavingsTrendChartProps) {
  const maxSavings = Math.max(...data.map((d) => d.netSavings), 1)

  return (
    <Card className="border border-border/80">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-success/15 text-success flex items-center justify-center">
              <PiggyBank className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Capital Retention Trend</CardTitle>
              <CardDescription className="text-xs">
                Monthly retained operating profit / net savings
              </CardDescription>
            </div>
          </div>
          <span className="text-xs text-success font-medium flex items-center gap-1 font-mono">
            <TrendingUp className="h-3.5 w-3.5" />
            +76.1% over 6 months
          </span>
        </div>
      </CardHeader>

      <CardContent>
        {/* Vertical bars with progressive height */}
        <div className="h-48 flex items-end gap-3 sm:gap-6 pt-4 pb-2 border-b border-border/60">
          {data.map((item) => {
            const heightPercent = (item.netSavings / maxSavings) * 100
            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                <div className="w-full flex justify-center h-full items-end">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-7 bg-emerald-500/80 hover:bg-emerald-500 rounded-t-sm transition-all duration-300"
                    title={`${item.month}: ${formatCurrency(item.netSavings)}`}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground font-medium mt-2 block truncate">
                  {item.month}
                </span>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px]">Latest Month Net Addition</span>
            <span className="font-mono font-bold text-foreground text-sm">
              {formatCurrency(data[data.length - 1]?.netSavings || 0)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground block text-[11px]">Average MoM Addition</span>
            <span className="font-mono font-bold text-foreground text-sm">
              {formatCurrency(
                Math.round(
                  data.reduce((sum, d) => sum + d.netSavings, 0) / (data.length || 1)
                )
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
