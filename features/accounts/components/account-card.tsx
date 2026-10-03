import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BankAccount } from "@/types/account"
import { formatCurrency, maskAccountNumber } from "@/lib/formatters"
import {
  CreditCard,
  Landmark,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  Info,
} from "lucide-react"

interface AccountCardProps {
  account: BankAccount
  onViewDetails: (account: BankAccount) => void
  onTransfer: (account: BankAccount) => void
}

export function AccountCard({
  account,
  onViewDetails,
  onTransfer,
}: AccountCardProps) {
  const isCredit = account.accountType === "credit"
  const isSavings = account.accountType === "savings"

  // Card theme styling
  const themeClasses: Record<string, string> = {
    navy: "from-slate-900 to-slate-800 text-white border-slate-700",
    emerald: "from-emerald-950 to-slate-900 text-white border-emerald-800/40",
    slate: "from-zinc-900 to-zinc-800 text-white border-zinc-700",
    indigo: "from-indigo-950 to-slate-900 text-white border-indigo-800/40",
  }

  const gradientClass = themeClasses[account.colorTheme || "slate"]

  return (
    <Card className="border border-border/80 bg-card overflow-hidden hover:border-border transition-all shadow-xs flex flex-col justify-between">
      {/* Visual Metallic / Sleek Card Facet */}
      <div
        className={`p-5 bg-gradient-to-br ${gradientClass} relative overflow-hidden flex flex-col justify-between min-h-[170px] select-none`}
      >
        {/* Background decorative watermark */}
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <Landmark className="h-32 w-32" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider opacity-75 block">
              {account.institutionName}
            </span>
            <span className="text-sm font-semibold tracking-tight block mt-0.5">
              {account.name}
            </span>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] border-white/20 text-white bg-white/10 uppercase"
          >
            {account.accountType}
          </Badge>
        </div>

        {/* Chip & Masked Number */}
        <div className="my-3 flex items-center justify-between">
          <div className="h-6 w-9 rounded-sm bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center">
            <CreditCard className="h-3.5 w-3.5 text-yellow-400" />
          </div>
          <span className="font-mono text-sm tracking-widest opacity-90">
            {maskAccountNumber(account.accountNumber)}
          </span>
        </div>

        {/* Balance representation */}
        <div className="flex items-baseline justify-between pt-1">
          <div>
            <span className="text-[10px] uppercase tracking-wider opacity-70 block">
              {isCredit ? "Outstanding Balance" : "Ledger Balance"}
            </span>
            <span className="text-xl font-bold font-mono">
              {formatCurrency(account.balance)}
            </span>
          </div>

          {account.interestRate && (
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider opacity-70 block">
                Annual APY
              </span>
              <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-0.5 justify-end">
                <TrendingUp className="h-3 w-3" />
                {(account.interestRate * 100).toFixed(2)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content & Action Controls */}
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span>Available to deploy</span>
          <span className="font-mono font-medium text-foreground">
            {formatCurrency(account.availableBalance)}
          </span>
        </div>

        {isCredit && account.creditLimit && (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Credit Line Utilized</span>
              <span className="font-mono font-medium text-foreground">
                {formatCurrency(Math.abs(account.balance))} / {formatCurrency(account.creditLimit)}
              </span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                style={{
                  width: `${Math.min(
                    100,
                    (Math.abs(account.balance) / account.creditLimit) * 100
                  )}%`,
                }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(account)}
            className="text-xs h-8 gap-1 border-border"
          >
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Details</span>
          </Button>
          <Button
            size="sm"
            onClick={() => onTransfer(account)}
            className="text-xs h-8 gap-1 bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>Transfer</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
