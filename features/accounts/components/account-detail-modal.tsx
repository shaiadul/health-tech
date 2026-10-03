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
import { BankAccount } from "@/types/account"
import { formatCurrency, maskAccountNumber } from "@/lib/formatters"
import { Copy, Check, ShieldCheck, Landmark } from "lucide-react"

interface AccountDetailModalProps {
  account: BankAccount | null
  open: boolean
  onClose: () => void
}

export function AccountDetailModal({
  account,
  open,
  onClose,
}: AccountDetailModalProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null)

  if (!account) return null

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard?.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="capitalize text-[10px]">
              {account.accountType} Account
            </Badge>
            <Badge variant="success" className="capitalize text-[10px]">
              {account.status}
            </Badge>
          </div>
          <DialogTitle className="text-lg font-bold">{account.name}</DialogTitle>
          <DialogDescription className="text-xs">
            Custodied at {account.institutionName}
          </DialogDescription>
        </DialogHeader>

        {/* Balance callout */}
        <div className="p-4 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">Ledger Balance</span>
            <div className="text-2xl font-bold font-mono text-foreground">
              {formatCurrency(account.balance)}
            </div>
            <span className="text-xs text-muted-foreground mt-0.5 block">
              Available: <strong className="text-foreground font-mono">{formatCurrency(account.availableBalance)}</strong>
            </span>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Landmark className="h-5 w-5" />
          </div>
        </div>

        {/* Wire & Clearing Information */}
        <div className="space-y-2 text-xs">
          <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider text-muted-foreground pt-1">
            Clearing & Routing Specifications
          </h4>

          {/* Account Number */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/50">
            <div>
              <span className="text-muted-foreground block text-[11px]">Account Number (Masked)</span>
              <span className="font-mono font-medium text-foreground">
                {maskAccountNumber(account.accountNumber)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(account.accountNumber, "account")}
              className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
            >
              {copiedField === "account" ? (
                <>
                  <Check className="h-3.5 w-3.5 text-success" />
                  <span className="text-success text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span className="text-[11px]">Copy</span>
                </>
              )}
            </Button>
          </div>

          {/* Routing Number */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/50">
            <div>
              <span className="text-muted-foreground block text-[11px]">ABA / ACH Routing Number</span>
              <span className="font-mono font-medium text-foreground">
                {account.routingNumber}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(account.routingNumber, "routing")}
              className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
            >
              {copiedField === "routing" ? (
                <>
                  <Check className="h-3.5 w-3.5 text-success" />
                  <span className="text-success text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span className="text-[11px]">Copy</span>
                </>
              )}
            </Button>
          </div>

          {/* SWIFT / Fedwire Code */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/50">
            <div>
              <span className="text-muted-foreground block text-[11px]">Wire Identifier / BIC</span>
              <span className="font-mono font-medium text-foreground">
                CHASUS33XXX
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard("CHASUS33XXX", "swift")}
              className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
            >
              {copiedField === "swift" ? (
                <>
                  <Check className="h-3.5 w-3.5 text-success" />
                  <span className="text-success text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span className="text-[11px]">Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-success">
            <ShieldCheck className="h-4 w-4" />
            <span>Direct Federal Reserve FedLine Connection</span>
          </div>
          <Button size="sm" className="text-xs h-8" onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
