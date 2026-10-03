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
  ChevronDown,
  LogOut,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { APP_NAME } from "@/lib/constants"
import { MOCK_USER } from "@/data/users"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const NAV_LINKS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: Receipt,
  },
  {
    name: "Accounts",
    href: "/accounts",
    icon: WalletCards,
  },
  {
    name: "Payments & Transfer",
    href: "/payments",
    icon: ArrowLeftRight,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: LineChart,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "hidden md:flex md:w-64 md:flex-col fixed inset-y-0 z-40 bg-sidebar border-r border-sidebar-border select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-base shadow-xs group-hover:bg-primary/90 transition-colors">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight text-sidebar-foreground block">
              {APP_NAME}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground block -mt-0.5">
              Treasury & Ops
            </span>
          </div>
        </Link>
      </div>

      {/* Organization Switcher Pill */}
      <div className="px-4 py-3 border-b border-sidebar-border/60">
        <div className="flex items-center justify-between p-2 rounded-lg bg-sidebar-accent/50 border border-sidebar-border/40">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            <div className="truncate text-left">
              <p className="text-xs font-medium text-sidebar-foreground truncate">
                {MOCK_USER.organization}
              </p>
              <p className="text-[10px] text-muted-foreground">Production Vault</p>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal shrink-0">
            {MOCK_USER.tier}
          </Badge>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 mb-2">
          <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Platform
          </p>
        </div>
        {NAV_LINKS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>

      {/* Security Status Card */}
      <div className="p-4 mx-3 mb-3 rounded-lg border border-sidebar-border bg-sidebar-accent/30 text-xs">
        <div className="flex items-center gap-1.5 text-success font-medium mb-1">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span>SOC-2 Type II Certified</span>
        </div>
        <p className="text-muted-foreground text-[11px] leading-relaxed">
          End-to-end 256-bit encryption active. Zero data sharing enabled.
        </p>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-sidebar-accent/60 transition-colors text-left focus:outline-none focus:ring-1 focus:ring-sidebar-ring">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Avatar className="h-8 w-8">
                <AvatarImage src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} />
                <AvatarFallback>AV</AvatarFallback>
              </Avatar>
              <div className="truncate">
                <p className="text-xs font-semibold text-sidebar-foreground truncate">
                  {MOCK_USER.name}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {MOCK_USER.role}
                </p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-xs font-medium text-foreground">{MOCK_USER.name}</p>
              <p className="text-[11px] text-muted-foreground font-normal">{MOCK_USER.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                <User className="h-4 w-4" />
                <span>Account Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                <span>Preferences</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login" className="flex items-center gap-2 text-destructive cursor-pointer">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
