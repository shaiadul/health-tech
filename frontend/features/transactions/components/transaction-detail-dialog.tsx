"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Transaction } from "@/types/transaction"
import { formatCurrency, formatDateTime } from "@/lib/formatters"
import { TRANSACTION_STATUS_VARIANTS } from "@/lib/constants"
import {
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Check,
  Download,
  ShieldCheck,
  FileText,
} from "lucide-react"

interface TransactionDetailDialogProps {
  transaction: Transaction | null
  open: boolean
  onClose: () => void
}

export function TransactionDetailDialog({
  transaction,
  open,
  onClose,
}: TransactionDetailDialogProps) {
  const [copied, setCopied] = React.useState(false)
  const [downloading, setDownloading] = React.useState(false)

  if (!transaction) return null

  const isIncome = transaction.type === "income"
  const statusMeta = TRANSACTION_STATUS_VARIANTS[transaction.status]

  const handleCopyRef = () => {
    navigator.clipboard?.writeText(transaction.referenceNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadReceipt = () => {
    setDownloading(true)
    setTimeout(() => {
      setDownloading(false)
      // trigger simulated download
      const receiptContent = `AEGIS FINANCIAL INSTITUTIONAL RECEIPT
--------------------------------------------
Transaction ID: ${transaction.id}
Reference: ${transaction.referenceNumber}
Date: ${formatDateTime(transaction.date)}
Merchant/Entity: ${transaction.merchant}
Category: ${transaction.category}
Settlement Rail: ${transaction.paymentMethod.toUpperCase()}
Amount: ${formatCurrency(transaction.amount)}
Funding Account: ${transaction.accountName}
Status: ${transaction.status.toUpperCase()}
--------------------------------------------
Verified Cryptographic Audit Hash: 0x8f2b7a912e
`
      const blob = new Blob([receiptContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Receipt-${transaction.referenceNumber}.txt`
      a.click()
      URL.revokeObjectURL(url)
    }, 600)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={statusMeta?.variant || "outline"} className="capitalize">
              {transaction.status}
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              {transaction.referenceNumber}
            </span>
          </div>
          <DialogTitle className="text-lg font-bold">{transaction.merchant}</DialogTitle>
          <DialogDescription className="text-xs">
            Settled via {transaction.paymentMethod.toUpperCase()} on {formatDateTime(transaction.date)}
          </DialogDescription>
        </DialogHeader>

        {/* Big Amount Card */}
        <div className="p-4 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">Transaction Total</span>
            <div
              className={`text-2xl font-bold font-mono ${
                isIncome ? "text-success" : "text-foreground"
              }`}
            >
              {isIncome ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </div>
          </div>
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center ${
              isIncome ? "bg-success/15 text-success" : "bg-muted text-foreground"
            }`}
          >
            {isIncome ? (
              <ArrowDownLeft className="h-5 w-5" />
            ) : (
              <ArrowUpRight className="h-5 w-5" />
            )}
          </div>
        </div>

        {/* Details list */}
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Category</span>
            <span className="font-medium text-foreground">{transaction.category}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Originating Account</span>
            <span className="font-medium text-foreground">{transaction.accountName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Payment Rail</span>
            <span className="font-medium text-foreground uppercase">
              {transaction.paymentMethod}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Settlement Time</span>
            <span className="font-medium text-foreground font-mono">
              {formatDateTime(transaction.date)}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Reference Number</span>
            <button
              type="button"
              onClick={handleCopyRef}
              className="flex items-center gap-1 font-mono font-medium text-primary hover:underline"
            >
              <span>{transaction.referenceNumber}</span>
              {copied ? (
                <Check className="h-3 w-3 text-success" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>
          {transaction.description && (
            <div className="pt-1">
              <span className="text-muted-foreground block mb-1">Description / Memo</span>
              <p className="p-2.5 bg-muted/30 rounded-md text-foreground border border-border/40 text-[11px] leading-relaxed">
                {transaction.description}
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[11px] text-success">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Audited & Signed</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 gap-1.5"
              onClick={handleDownloadReceipt}
              disabled={downloading}
            >
              {downloading ? (
                <>Generating...</>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  Receipt
                </>
              )}
            </Button>
            <Button size="sm" className="text-xs h-8" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
