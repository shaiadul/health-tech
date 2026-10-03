"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Menu,
  Bell,
  Search,
  PlusCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Activity,
  UserCheck,
  Stethoscope,
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
    title: "Clinic Operations & Triage",
    subtitle: "Real-time outpatient queue, examination room status, and doctor availability",
  },
  "/transactions": {
    title: "Outpatient Appointment Ledger",
    subtitle: "Complete clinical appointments, telemedicine links, and triage logs",
  },
  "/accounts": {
    title: "Physician Staff & Specialists",
    subtitle: "Board-certified doctors, on-duty shifts, and clinical departments",
  },
  "/payments": {
    title: "Patient Admissions & Billing",
    subtitle: "Outpatient check-in status, insurance verification, and triage records",
  },
  "/analytics": {
    title: "Clinical Department Analytics",
    subtitle: "Patient volume trends, telehealth ratio, and consultation metrics",
  },
  "/settings": {
    title: "Facility & Clinic Settings",
    subtitle: "Operating hours, emergency contact rules, and clinic parameters",
  },
}

export function Header({
  onOpenQuickAction,
}: {
  onOpenQuickAction?: (action: "triage" | "schedule") => void
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  // Find current route title or fallback
  const activeMeta = Object.entries(PAGE_TITLES).find(
    ([route]) => pathname === route || pathname.startsWith(`${route}/`)
  )?.[1] || {
    title: "Hospital Operations",
    subtitle: "Clinical administrative control center",
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/90 px-4 md:px-8 backdrop-blur-md">
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

          <div>
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
              placeholder="Search patient, doctor, room..."
              className="pl-8 h-9 text-xs bg-muted/40 border-border focus-visible:bg-background"
            />
          </div>

          {/* Quick Actions Buttons */}
          <div className="flex items-center gap-1.5">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden sm:flex text-xs h-9 gap-1.5 border-border"
            >
              <Link href="/portal">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>Patient Portal</span>
              </Link>
            </Button>

            <Button
              asChild
              size="sm"
              className="text-xs h-9 gap-1.5 bg-primary text-primary-foreground font-medium shadow-xs"
            >
              <Link href="/book">
                <PlusCircle className="h-3.5 w-3.5" />
                <span>New Booking</span>
              </Link>
            </Button>
          </div>

          {/* Clinical Notifications Dropdown */}
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
                <span className="text-xs font-semibold text-foreground">Clinic Alerts</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary">
                  3 active
                </Badge>
              </div>
              <div className="divide-y divide-border/60 max-h-72 overflow-y-auto">
                <div className="p-3 hover:bg-muted/40 transition-colors flex gap-2.5 items-start">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-medium text-foreground">New Appointment Booked</p>
                    <p className="text-muted-foreground text-[11px]">James Miller · Cardiology with Dr. Sarah Ahmed</p>
                    <span className="text-[10px] text-muted-foreground">10m ago</span>
                  </div>
                </div>
                <div className="p-3 hover:bg-muted/40 transition-colors flex gap-2.5 items-start">
                  <Activity className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-medium text-foreground">Exam Room 302 Ready</p>
                    <p className="text-muted-foreground text-[11px]">Cleaned and prepped for Neurological evaluation</p>
                    <span className="text-[10px] text-muted-foreground">35m ago</span>
                  </div>
                </div>
                <div className="p-3 hover:bg-muted/40 transition-colors flex gap-2.5 items-start">
                  <Clock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-medium text-foreground">Physician Shift Handover</p>
                    <p className="text-muted-foreground text-[11px]">Pediatrics on-call attending checked in for evening shift</p>
                    <span className="text-[10px] text-muted-foreground">1h ago</span>
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
