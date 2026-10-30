import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BankAccount } from "@/types/account"
import { formatCurrency, maskAccountNumber } from "@/lib/formatters"
import { ArrowRight, Landmark } from "lucide-react"

interface AccountSummaryProps {
  accounts: BankAccount[]
}

export function AccountSummary({ accounts }: AccountSummaryProps) {
  return (
    <Card className="border border-border/80">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold">Account Balances</CardTitle>
          <CardDescription className="text-xs">
            Direct clearing & custodial vaults
          </CardDescription>
        </div>
        <Link
          href="/accounts"
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
        >
          <span>All Accounts</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="space-y-3 pt-1">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-9 w-9 rounded-md bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
                <Landmark className="h-4 w-4" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {acc.name}
                  </p>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 uppercase">
                    {acc.accountType}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                  {maskAccountNumber(acc.accountNumber)} • {acc.institutionName}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0 pl-2">
              <span className="text-sm font-bold font-mono text-foreground block">
                {formatCurrency(acc.balance)}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {acc.accountType === "credit" ? "Current Balance" : "Available"}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
