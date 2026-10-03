import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatPercentage } from "@/lib/formatters"
import {
  TrendingUp,
  ShieldCheck,
  Eye,
  EyeOff,
  Copy,
  Check,
} from "lucide-react"

interface BalanceCardProps {
  totalBalance: number
  availableBalance: number
  growthRate: number
  onQuickAction?: (action: "send" | "add" | "transfer") => void
}

export function BalanceCard({
  totalBalance,
  availableBalance,
  growthRate,
  onQuickAction,
}: BalanceCardProps) {
  const [showBalance, setShowBalance] = React.useState(true)
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard?.writeText(String(totalBalance / 100))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border border-border/80 bg-gradient-to-br from-card via-card to-muted/30 shadow-xs relative overflow-hidden">
      {/* Subtle accent bar on top */}
      <div className="absolute top-0 inset-x-0 h-1 bg-primary/80" />

      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Portfolio Liquidity
              </span>
              <button
                type="button"
                onClick={() => setShowBalance(!showBalance)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showBalance ? "Hide balance" : "Show balance"}
              >
                {showBalance ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-mono">
                {showBalance ? formatCurrency(totalBalance) : "••••••••••"}
              </span>
              <Badge variant="success" className="gap-1 font-mono text-xs">
                <TrendingUp className="h-3 w-3" />
                {formatPercentage(growthRate)}
              </Badge>
            </div>

            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>
                Available:{" "}
                <strong className="text-foreground font-mono">
                  {showBalance ? formatCurrency(availableBalance) : "••••••"}
                </strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-success">
                <ShieldCheck className="h-3.5 w-3.5" /> FDIC Insured sweeps to $2.5M
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 border-border"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-success mr-1.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                  Copy Balance
                </>
              )}
            </Button>
            {onQuickAction && (
              <Button
                size="sm"
                className="text-xs h-8 bg-primary text-primary-foreground font-medium"
                onClick={() => onQuickAction("transfer")}
              >
                Move Funds
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
