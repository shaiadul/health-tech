import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Transaction } from "@/types/transaction"
import { formatCurrency, formatDate } from "@/lib/formatters"
import { TRANSACTION_STATUS_VARIANTS } from "@/lib/constants"
import { ArrowDownLeft, ArrowUpRight, ChevronRight } from "lucide-react"

interface TransactionTableProps {
  transactions: Transaction[]
  onSelectTransaction: (transaction: Transaction) => void
}

export function TransactionTable({
  transactions,
  onSelectTransaction,
}: TransactionTableProps) {
  return (
    <div className="hidden md:block rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="w-[300px]">Merchant / Entity</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount (USD)</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => {
            const isIncome = tx.type === "income"
            const statusMeta = TRANSACTION_STATUS_VARIANTS[tx.status]

            return (
              <TableRow
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="cursor-pointer hover:bg-muted/30 transition-colors group"
              >
                {/* Merchant & Reference */}
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
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
                    <div className="truncate max-w-[210px]">
                      <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {tx.merchant}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono truncate">
                        {tx.referenceNumber}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell className="text-xs text-muted-foreground">
                  {tx.category}
                </TableCell>

                {/* Account */}
                <TableCell className="text-xs text-muted-foreground">
                  <span className="truncate max-w-[150px] block">
                    {tx.accountName}
                  </span>
                </TableCell>

                {/* Date */}
                <TableCell className="text-xs text-muted-foreground font-mono">
                  {formatDate(tx.date)}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    variant={statusMeta?.variant || "outline"}
                    className="text-[10px] px-2 py-0 capitalize"
                  >
                    {tx.status}
                  </Badge>
                </TableCell>

                {/* Amount */}
                <TableCell className="text-right">
                  <span
                    className={`font-mono text-sm font-semibold ${
                      isIncome ? "text-success" : "text-foreground"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </span>
                </TableCell>

                {/* Action arrow */}
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground group-hover:text-foreground"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
