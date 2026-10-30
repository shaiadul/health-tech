import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Transaction } from "@/types/transaction"
import { formatCurrency, formatRelativeDate } from "@/lib/formatters"
import { TRANSACTION_STATUS_VARIANTS } from "@/lib/constants"
import { ArrowDownLeft, ArrowUpRight, ArrowRight } from "lucide-react"

interface TransactionListProps {
  transactions: Transaction[]
  onSelectTransaction?: (transaction: Transaction) => void
}

export function TransactionList({
  transactions,
  onSelectTransaction,
}: TransactionListProps) {
  return (
    <Card className="border border-border/80">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold">Recent Ledger Activity</CardTitle>
          <CardDescription className="text-xs">
            Real-time feed of inflows and expenditures
          </CardDescription>
        </div>
        <Link
          href="/transactions"
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-border/60">
          {transactions.map((tx) => {
            const isIncome = tx.type === "income"
            const statusMeta = TRANSACTION_STATUS_VARIANTS[tx.status]

            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction?.(tx)}
                className="flex items-center justify-between p-4 hover:bg-muted/40 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isIncome
                        ? "bg-success/15 text-success"
                        : "bg-muted text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {tx.merchant}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {tx.category} • {formatRelativeDate(tx.date)}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-3">
                  <span
                    className={`text-sm font-bold font-mono block ${
                      isIncome ? "text-success" : "text-foreground"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </span>
                  <Badge
                    variant={statusMeta?.variant || "outline"}
                    className="text-[10px] px-1.5 py-0 capitalize"
                  >
                    {tx.status}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
