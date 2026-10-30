"use client"

import * as React from "react"
import { PaymentWizard } from "./payment-wizard"
import { QuickAccountTransfer } from "./quick-account-transfer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BankAccount } from "@/types/account"
import { Recipient } from "@/types/payment"
import { formatCurrency } from "@/lib/formatters"
import { Clock, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react"

interface PaymentsViewProps {
  accounts: BankAccount[]
  recipients: Recipient[]
}

const UPCOMING_SCHEDULED = [
  {
    id: "sch_01",
    entity: "Gusto Payroll Operations",
    amount: 8850000,
    frequency: "Bi-weekly",
    nextDate: "Oct 15, 2026",
    status: "scheduled",
  },
  {
    id: "sch_02",
    entity: "WeWork Global HQ Lease",
    amount: 1250000,
    frequency: "Monthly",
    nextDate: "Nov 01, 2026",
    status: "scheduled",
  },
  {
    id: "sch_03",
    entity: "Equinix Data Centers",
    amount: 480000,
    frequency: "Monthly",
    nextDate: "Oct 19, 2026",
    status: "retrying",
  },
]

export function PaymentsView({ accounts, recipients }: PaymentsViewProps) {
  const [successToast, setSuccessToast] = React.useState(false)

  const handlePaymentSuccess = () => {
    setSuccessToast(true)
    setTimeout(() => setSuccessToast(false), 5000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Treasury Payments & Transfers
          </h2>
          <p className="text-xs text-muted-foreground">
            Multi-rail disbursements, payroll feeds, and institutional Fedwire routing
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-success" />
          <span>FIPS 140-3 Hardware Security Enclave Active</span>
        </div>
      </div>

      {successToast && (
        <div className="p-3 bg-success/15 border border-success/30 text-success text-xs rounded-lg flex items-center justify-between animate-in fade-in-50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-semibold">
              Payment was recorded in transaction ledger and broadcast across settlement rails.
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSuccessToast(false)}
            className="h-6 text-xs hover:bg-success/20"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Main Grid: Payment Wizard & Side widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PaymentWizard
            accounts={accounts}
            recipients={recipients}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>

        <div className="space-y-6">
          {/* Quick Inter-Vault Internal Transfer */}
          <QuickAccountTransfer accounts={accounts} />

          {/* Scheduled and Recurring Disbursements */}
          <Card className="border border-border/80">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">
                    Scheduled Disbursements
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Automated payroll & vendor standing orders
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  3 Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {UPCOMING_SCHEDULED.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-foreground truncate max-w-[170px]">
                      {item.entity}
                    </span>
                    <span className="font-mono text-xs font-bold text-foreground">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.nextDate} ({item.frequency})
                    </span>
                    <Badge
                      variant={item.status === "retrying" ? "warning" : "secondary"}
                      className="text-[9px] px-1 py-0 uppercase"
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
