"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Menu,
  Bell,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  Activity,
  Stethoscope,
  Building2,
  Video,
  ArrowRightLeft,
  User,
  LogOut,
} from "lucide-react"
import { useAuth, DEMO_USERS } from "@/lib/auth-context"
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

export function Header({
  onOpenQuickAction,
}: {
  onOpenQuickAction?: (action: "triage" | "schedule") => void
} = {}) {
  const pathname = usePathname()
  const router = useRouter()
  const { role, user, switchRole, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const isDoctor = role === "doctor"
  const currentUser = user || (isDoctor ? DEMO_USERS.doctor : DEMO_USERS.organizer)

  const pageMeta: Record<string, { title: string; subtitle: string }> = {
    "/dashboard": {
      title: isDoctor ? "Physician Workstation" : "Clinic Operations & Triage",
      subtitle: isDoctor
        ? "Assigned patient queue, encrypted video room & electronic SOAP charting"
        : "Real-time outpatient queue, examination room status, and doctor availability",
    },
    "/transactions": {
      title: isDoctor ? "My Patient Queue & Ledger" : "Outpatient Appointment Ledger",
      subtitle: isDoctor
        ? "Attending patient encounters, telemedicine status & triage notes"
        : "Complete clinical appointments, telemedicine links, and triage logs",
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
      title: isDoctor ? "Doctor Profile & Schedule" : "Facility & Clinic Settings",
      subtitle: isDoctor
        ? "Clinical credentials, consultation room parameters & schedule"
        : "Operating hours, emergency contact rules, and clinic parameters",
    },
  }

  const activeMeta = Object.entries(pageMeta).find(
    ([route]) => pathname === route || pathname.startsWith(`${route}/`)
  )?.[1] || {
    title: isDoctor ? "Physician Workstation" : "Hospital Operations",
    subtitle: isDoctor ? "Clinical Care Station" : "Clinical administrative control center",
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
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
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-foreground tracking-tight">
                {activeMeta.title}
              </h1>
              <Badge
                variant="outline"
                className={`text-[9px] font-mono capitalize hidden sm:inline-flex ${
                  isDoctor
                    ? "border-primary/40 text-primary bg-primary/10"
                    : "border-teal-500/40 text-teal-700 dark:text-teal-300 bg-teal-500/10"
                }`}
              >
                {isDoctor ? "Doctor View" : "Admin View"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground hidden lg:block">
              {activeMeta.subtitle}
            </p>
          </div>
        </div>

        {/* Global Search and Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Search bar */}
          <div className="relative hidden md:block w-48 lg:w-56">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={isDoctor ? "Search my patients..." : "Search patients, rooms..."}
              className="pl-8 h-9 text-xs bg-muted/40 border-border focus-visible:bg-background font-mono"
            />
          </div>

          {/* Role Switcher Pill / Dropdown in Header */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-9 px-2.5 gap-1.5 border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-mono cursor-pointer"
              >
                {isDoctor ? <Stethoscope className="h-3.5 w-3.5" /> : <Building2 className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">
                  {isDoctor ? "Doctor" : "Hospital Admin"}
                </span>
                <ArrowRightLeft className="h-3 w-3 opacity-60 ml-0.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="text-xs font-mono text-muted-foreground">
                Switch Role Perspective
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => switchRole("organizer")}
                className={`cursor-pointer text-xs ${!isDoctor ? "font-bold bg-muted/50" : ""}`}
              >
                <Building2 className="mr-2 h-4 w-4 text-teal-600" />
                <div className="flex flex-col">
                  <span>Hospital Management</span>
                  <span className="text-[10px] text-muted-foreground">Admin Operations & Roster</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => switchRole("doctor")}
                className={`cursor-pointer text-xs ${isDoctor ? "font-bold bg-muted/50" : ""}`}
              >
                <Stethoscope className="mr-2 h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span>Attending Doctor</span>
                  <span className="text-[10px] text-muted-foreground">Physician Workstation & Video</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Actions Buttons */}
          <div className="flex items-center gap-1.5">
            {isDoctor ? (
              <Button
                asChild
                size="sm"
                className="hidden sm:flex text-xs h-9 px-3 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
              >
                <Link href="/consultation">
                  <Video className="h-3.5 w-3.5" />
                  <span>Video Room</span>
                </Link>
              </Button>
            ) : (
              onOpenQuickAction && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenQuickAction("schedule")}
                  className="hidden lg:flex text-xs h-9 gap-1.5 border-border"
                >
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>Quick Schedule</span>
                </Button>
              )
            )}

            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden md:flex text-xs h-9 gap-1.5 border-border"
            >
              <Link href="/portal">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Portal View</span>
              </Link>
            </Button>
          </div>

          {/* Clinical Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="p-3 border-b border-border flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Clinical Alerts</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary">
                  {isDoctor ? "2 active" : "3 active"}
                </Badge>
              </div>
              <div className="divide-y divide-border/60 max-h-72 overflow-y-auto">
                {isDoctor ? (
                  <>
                    <div className="p-3 hover:bg-muted/40 transition-colors flex gap-2.5 items-start">
                      <Video className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-medium text-foreground">Patient in Virtual Waiting Room</p>
                        <p className="text-muted-foreground text-[11px]">Alex Mercer checked into Telehealth Suite</p>
                        <span className="text-[10px] text-muted-foreground">5m ago</span>
                      </div>
                    </div>
                    <div className="p-3 hover:bg-muted/40 transition-colors flex gap-2.5 items-start">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-medium text-foreground">ECG Lab Report Ready</p>
                        <p className="text-muted-foreground text-[11px]">12-lead ECG digitized for Eleanor Vance</p>
                        <span className="text-[10px] text-muted-foreground">22m ago</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
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
                        <p className="text-muted-foreground text-[11px]">Cleaned and prepped for evaluation</p>
                        <span className="text-[10px] text-muted-foreground">35m ago</span>
                      </div>
                    </div>
                  </>
                )}
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
