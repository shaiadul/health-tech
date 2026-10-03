"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  UserCheck,
  Activity,
  LineChart,
  Settings,
  HeartPulse,
  Building2,
  LogOut,
  User,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { APP_NAME } from "@/lib/constants"
import { MOCK_USER } from "@/data/users"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

const NAV_LINKS = [
  { name: "Clinic Operations", href: "/dashboard", icon: LayoutDashboard },
  { name: "Appointment Queue", href: "/transactions", icon: Calendar },
  { name: "Physician Roster", href: "/accounts", icon: UserCheck },
  { name: "Patient Admissions", href: "/payments", icon: Activity },
  { name: "Clinical Analytics", href: "/analytics", icon: LineChart },
  { name: "Facility Settings", href: "/settings", icon: Settings },
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
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <SheetTitle className="text-sm font-semibold tracking-tight">
                  {APP_NAME}
                </SheetTitle>
                <p className="text-[11px] text-muted-foreground">Hospital Operations</p>
              </div>
            </div>
          </SheetHeader>

          {/* Unit preview */}
          <div className="p-3 border-b border-border/50">
            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-foreground">
                  Main Clinic Center
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-500/10">
                Active
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

        {/* User Footer Profile */}
        <div className="p-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8 rounded-full border border-border">
              <AvatarImage src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-xs font-medium text-foreground truncate max-w-[140px]">
                {MOCK_USER.name}
              </p>
              <p className="text-[10px] text-muted-foreground">{MOCK_USER.role}</p>
            </div>
          </div>
          <Link
            href="/"
            onClick={() => onOpenChange(false)}
            className="p-1.5 text-muted-foreground hover:text-destructive"
            title="Exit Admin"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
