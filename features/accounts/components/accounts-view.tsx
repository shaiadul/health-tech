"use client"

import * as React from "react"
import { AccountCard } from "./account-card"
import { AccountDetailModal } from "./account-detail-modal"
import { AddAccountDialog } from "./add-account-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BankAccount } from "@/types/account"
import { formatCurrency } from "@/lib/formatters"
import { QuickActionDialogs } from "@/components/layout/quick-action-dialogs"
import { PlusCircle, ShieldCheck, Wallet, ArrowDownRight, ArrowUpRight } from "lucide-react"

interface AccountsViewProps {
  initialAccounts: BankAccount[]
  initialBalances: {
    netWorth: number
    totalAssets: number
    totalLiabilities: number
    totalAvailable: number
  }
}

export function AccountsView({
  initialAccounts,
  initialBalances,
}: AccountsViewProps) {
  const [accounts, setAccounts] = React.useState<BankAccount[]>(initialAccounts)
  const [balances, setBalances] = React.useState(initialBalances)
  const [selectedAccount, setSelectedAccount] = React.useState<BankAccount | null>(null)
  const [addAccountOpen, setAddAccountOpen] = React.useState(false)
  const [transferOpen, setTransferOpen] = React.useState(false)

  const handleAccountAdded = (newAcc: BankAccount) => {
    const updated = [...accounts, newAcc]
    setAccounts(updated)
    setBalances({
      ...balances,
      totalAssets: balances.totalAssets + newAcc.balance,
      netWorth: balances.netWorth + newAcc.balance,
      totalAvailable: balances.totalAvailable + newAcc.availableBalance,
    })
  }

  return (
    <div className="space-y-6">
      {/* Top Banner and Summary Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Treasury & Vault Accounts
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage institutional capital allocations, credit facilities, and routing
          </p>
        </div>
        <Button
          onClick={() => setAddAccountOpen(true)}
          className="text-xs h-9 gap-1.5 self-start sm:self-auto bg-primary text-primary-foreground font-medium"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Open New Account</span>
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs uppercase font-medium">Consolidated Net Worth</span>
              <Wallet className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {formatCurrency(balances.netWorth)}
            </div>
            <span className="text-[11px] text-success flex items-center gap-1 mt-1">
              <ShieldCheck className="h-3.5 w-3.5" /> 100% Backed by Tier-1 Capital
            </span>
          </CardContent>
        </Card>

        <Card className="border border-border/80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs uppercase font-medium">Total Liquid Assets</span>
              <ArrowDownRight className="h-4 w-4 text-success" />
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {formatCurrency(balances.totalAssets)}
            </div>
            <span className="text-[11px] text-muted-foreground mt-1 block">
              Across checking, HYSA & T-bills
            </span>
          </CardContent>
        </Card>

        <Card className="border border-border/80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs uppercase font-medium">Active Liabilities</span>
              <ArrowUpRight className="h-4 w-4 text-warning" />
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {formatCurrency(balances.totalLiabilities)}
            </div>
            <span className="text-[11px] text-muted-foreground mt-1 block">
              Corporate revolving credit lines
            </span>
          </CardContent>
        </Card>

        <Card className="border border-border/80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs uppercase font-medium">Ready Liquidity</span>
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {formatCurrency(balances.totalAvailable)}
            </div>
            <span className="text-[11px] text-muted-foreground mt-1 block">
              Immediate settlement capacity
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {accounts.map((acc) => (
          <AccountCard
            key={acc.id}
            account={acc}
            onViewDetails={(a) => setSelectedAccount(a)}
            onTransfer={() => setTransferOpen(true)}
          />
        ))}
      </div>

      {/* Account Details Modal */}
      <AccountDetailModal
        account={selectedAccount}
        open={!!selectedAccount}
        onClose={() => setSelectedAccount(null)}
      />

      {/* Add Account Dialog */}
      <AddAccountDialog
        open={addAccountOpen}
        onClose={() => setAddAccountOpen(false)}
        onAccountAdded={handleAccountAdded}
      />

      {/* Transfer Dialog */}
      <QuickActionDialogs
        action={transferOpen ? "transfer" : null}
        onClose={() => setTransferOpen(false)}
      />
    </div>
  )
}
