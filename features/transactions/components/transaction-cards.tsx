import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Transaction } from "@/types/transaction"
import { formatCurrency, formatDate } from "@/lib/formatters"
import { TRANSACTION_STATUS_VARIANTS } from "@/lib/constants"
import { ArrowDownLeft, ArrowUpRight, ChevronRight } from "lucide-react"

interface TransactionCardsProps {
  transactions: Transaction[]
  onSelectTransaction: (transaction: Transaction) => void
}

export function TransactionCards({
  transactions,
  onSelectTransaction,
}: TransactionCardsProps) {
  return (
    <div className="block md:hidden space-y-2.5">
      {transactions.map((tx) => {
        const isIncome = tx.type === "income"
        const statusMeta = TRANSACTION_STATUS_VARIANTS[tx.status]

        return (
          <Card
            key={tx.id}
            onClick={() => onSelectTransaction(tx)}
            className="border border-border/80 hover:border-primary/50 transition-all cursor-pointer shadow-2xs"
          >
            <CardContent className="p-3.5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isIncome
                        ? "bg-success/15 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {tx.merchant}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {formatDate(tx.date)}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`font-mono text-sm font-bold block ${
                      isIncome ? "text-success" : "text-foreground"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                <span className="truncate max-w-[160px]">{tx.category}</span>
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant={statusMeta?.variant || "outline"}
                    className="text-[9px] px-1.5 py-0 capitalize"
                  >
                    {tx.status}
                  </Badge>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
