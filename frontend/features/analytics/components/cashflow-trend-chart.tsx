"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CashflowTrendPoint } from "@/types/analytics"
import { formatCurrency, formatCompactCurrency } from "@/lib/formatters"

interface CashflowTrendChartProps {
  data: CashflowTrendPoint[]
}

export function CashflowTrendChart({ data }: CashflowTrendChartProps) {
  const [activePoint, setActivePoint] = React.useState<CashflowTrendPoint | null>(
    data[data.length - 1] || null
  )

  const maxBalance = Math.max(...data.map((d) => d.netBalance), 1)
  const minBalance = Math.min(...data.map((d) => d.netBalance), 0)

  // Generate SVG path for line chart
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((d.netBalance - minBalance) / (maxBalance - minBalance || 1)) * 80 - 10
    return `${x},${y}`
  })
  const pathD = `M ${points.join(" L ")}`
  const areaD = `${pathD} L 100,100 L 0,100 Z`

  return (
    <Card className="border border-border/80">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-bold">Liquidity Trajectory</CardTitle>
            <CardDescription className="text-xs">
              Net portfolio treasury balance evolution over time
            </CardDescription>
          </div>
          {activePoint && (
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">{activePoint.date}</span>
              <span className="text-lg font-bold font-mono text-primary">
                {formatCurrency(activePoint.netBalance)}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* SVG Curve Canvas */}
        <div className="relative h-60 w-full pt-4">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="liquidityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            <line x1="0" y1="20" x2="100" y2="20" stroke="var(--border)" strokeDasharray="2" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="var(--border)" strokeDasharray="2" strokeWidth="0.5" />
            <line x1="0" y1="80" x2="100" y2="80" stroke="var(--border)" strokeDasharray="2" strokeWidth="0.5" />

            {/* Area Fill */}
            <path d={areaD} fill="url(#liquidityGradient)" />

            {/* Main Line */}
            <path
              d={pathD}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Interactive touch/hover points */}
          <div className="absolute inset-0 flex justify-between items-center px-1">
            {data.map((d) => (
              <div
                key={d.date}
                className="h-full flex-1 flex flex-col justify-end items-center cursor-pointer group"
                onMouseEnter={() => setActivePoint(d)}
              >
                <div
                  className={`h-2.5 w-2.5 rounded-full border-2 transition-all ${
                    activePoint?.date === d.date
                      ? "bg-primary border-background scale-125 ring-2 ring-primary/40"
                      : "bg-background border-primary/40 group-hover:border-primary"
                  }`}
                />
                <span className="text-[10px] text-muted-foreground font-mono mt-3">
                  {d.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/60 text-xs text-muted-foreground">
          <span>Min: <strong className="font-mono text-foreground">{formatCompactCurrency(minBalance)}</strong></span>
          <span>Max: <strong className="font-mono text-foreground">{formatCompactCurrency(maxBalance)}</strong></span>
        </div>
      </CardContent>
    </Card>
  )
}
