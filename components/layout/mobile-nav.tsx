"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Receipt,
  WalletCards,
  ArrowLeftRight,
  LineChart,
  Settings,
  ShieldCheck,
  Building2,
  LogOut,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { APP_NAME } from "@/lib/constants"
import { MOCK_USER } from "@/data/users"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

const NAV_LINKS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: Receipt },
  { name: "Accounts", href: "/accounts", icon: WalletCards },
  { name: "Payments & Transfer", href: "/payments", icon: ArrowLeftRight },
  { name: "Analytics", href: "/analytics", icon: LineChart },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function MobileNav({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] p-0 flex flex-col justify-between">
        <div>
          <SheetHeader className="p-4 border-b border-border text-left">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <SheetTitle className="text-sm font-semibold tracking-tight">
                  {APP_NAME}
                </SheetTitle>
                <p className="text-[11px] text-muted-foreground">Treasury & Ops</p>
              </div>
            </div>
          </SheetHeader>

          {/* Org preview */}
          <div className="p-3 border-b border-border/50">
            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-foreground">
                  {MOCK_USER.organization}
                </span>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {MOCK_USER.tier}
              </Badge>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {NAV_LINKS.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-secondary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Info footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} />
              <AvatarFallback>AV</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-foreground truncate">
                {MOCK_USER.name}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {MOCK_USER.email}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
            <Link
              href="/settings"
              onClick={() => onOpenChange(false)}
              className="flex items-center justify-center gap-1.5 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-md"
            >
              <User className="h-3.5 w-3.5" />
              <span>Profile</span>
            </Link>
            <Link
              href="/login"
              onClick={() => onOpenChange(false)}
              className="flex items-center justify-center gap-1.5 py-1.5 text-xs text-destructive hover:bg-destructive/10 border border-destructive/20 rounded-md"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
