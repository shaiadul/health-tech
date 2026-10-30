"use client"

import * as React from "react"
import {
  ArrowUpRight,
  PlusCircle,
  Receipt,
  ArrowLeftRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuickActionsProps {
  onActionClick: (action: "send" | "add" | "bill" | "transfer") => void
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  const actions = [
    {
      id: "send" as const,
      label: "Send Money",
      desc: "Wire or instant payout",
      icon: ArrowUpRight,
      highlight: true,
    },
    {
      id: "add" as const,
      label: "Add Money",
      desc: "ACH or external deposit",
      icon: PlusCircle,
      highlight: false,
    },
    {
      id: "bill" as const,
      label: "Pay Bill",
      desc: "Vendor or recurring invoices",
      icon: Receipt,
      highlight: false,
    },
    {
      id: "transfer" as const,
      label: "Transfer",
      desc: "Move between accounts",
      icon: ArrowLeftRight,
      highlight: false,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {actions.map((act) => {
        const Icon = act.icon
        return (
          <Button
            key={act.id}
            variant={act.highlight ? "default" : "outline"}
            className="h-auto p-4 flex flex-col items-start justify-between text-left group border-border/80 transition-all hover:border-primary/40 hover:shadow-xs"
            onClick={() => onActionClick(act.id)}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div
                className={`h-9 w-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${
                  act.highlight
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
                Instant
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">{act.label}</p>
              <p
                className={`text-[11px] mt-0.5 ${
                  act.highlight ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}
              >
                {act.desc}
              </p>
            </div>
          </Button>
        )
      })}
    </div>
  )
}
