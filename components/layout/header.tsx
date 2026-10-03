"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  Menu,
  Bell,
  Search,
  PlusCircle,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MobileNav } from "./mobile-nav"

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Financial Overview",
    subtitle: "Consolidated enterprise treasury and liquidity management",
  },
  "/transactions": {
    title: "Transaction Ledger",
    subtitle: "Complete operational cashflow and audit records",
  },
  "/accounts": {
    title: "Accounts & Reserves",
    subtitle: "Institutional accounts, checking lines, and credit facilities",
  },
  "/payments": {
    title: "Payments & Transfers",
    subtitle: "Execute multi-rail wires, ACH, and vendor disbursements",
  },
  "/analytics": {
    title: "Treasury Analytics",
    subtitle: "Cashflow forecasting, variance tracking, and expense breakdown",
  },
  "/settings": {
    title: "System Settings",
    subtitle: "Entity profile, authentication controls, and security policies",
  },
}

export function Header({
  onOpenQuickAction,
}: {
  onOpenQuickAction?: (action: "send" | "add" | "bill" | "transfer") => void
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  // Find current route title or fallback
  const activeMeta = Object.entries(PAGE_TITLES).find(
    ([route]) => pathname === route || pathname.startsWith(`${route}/`)
  )?.[1] || {
    title: "Dashboard",
    subtitle: "Treasury operations",
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/85 px-4 md:px-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden sm:block">
            <h1 className="text-base font-semibold text-foreground tracking-tight">
              {activeMeta.title}
            </h1>
            <p className="text-xs text-muted-foreground hidden lg:block">
              {activeMeta.subtitle}
            </p>
          </div>
        </div>

        {/* Global Search and Actions */}
        <div className="flex items-center gap-2.5">
          {/* Search bar */}
          <div className="relative hidden md:block w-52 lg:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search reference, merchant..."
              className="pl-8 h-9 text-xs bg-muted/40 border-border focus-visible:bg-background"
            />
          </div>

          {/* Quick Actions Button */}
          {onOpenQuickAction && (
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex text-xs h-9 gap-1.5 border-border"
                onClick={() => onOpenQuickAction("transfer")}
              >
                <PlusCircle className="h-3.5 w-3.5 text-primary" />
                <span>Add Money</span>
              </Button>

              <Button
                size="sm"
                className="text-xs h-9 gap-1.5 bg-primary text-primary-foreground font-medium shadow-xs"
                onClick={() => onOpenQuickAction("send")}
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>Send Money</span>
              </Button>
            </div>
          )}

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
                aria-label="View notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="p-3 border-b border-border flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Notifications</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  3 unread
                </Badge>
              </div>
              <div className="divide-y divide-border/60 max-h-72 overflow-y-auto">
                <div className="p-3 hover:bg-muted/40 transition-colors flex gap-2.5 items-start">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-medium text-foreground">Stripe Settlement Cleared</p>
                    <p className="text-muted-foreground text-[11px]">$142,850.00 credited to Checking</p>
                    <span className="text-[10px] text-muted-foreground">12m ago</span>
                  </div>
                </div>
                <div className="p-3 hover:bg-muted/40 transition-colors flex gap-2.5 items-start">
                  <Clock className="h-4 w-4 text-warning-foreground shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-medium text-foreground">Wire Approval Required</p>
                    <p className="text-muted-foreground text-[11px]">$15,000.00 to Latham & Watkins</p>
                    <span className="text-[10px] text-muted-foreground">1h ago</span>
                  </div>
                </div>
                <div className="p-3 hover:bg-muted/40 transition-colors flex gap-2.5 items-start">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-medium text-foreground">New Login Session</p>
                    <p className="text-muted-foreground text-[11px]">MacBook Pro 16&quot; from San Francisco</p>
                    <span className="text-[10px] text-muted-foreground">3h ago</span>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile nav drawer */}
      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
    </>
  )
}
