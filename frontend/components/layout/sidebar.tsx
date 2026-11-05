"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  UserCheck,
  Activity,
  LineChart,
  Settings,
  Building2,
  ChevronDown,
  LogOut,
  User,
  HeartPulse,
  ShieldCheck,
  ExternalLink,
  PlusCircle,
  Stethoscope,
  Video,
  ArrowRightLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { APP_NAME } from "@/lib/constants"
import { useAuth, DEMO_USERS } from "@/lib/auth-context"
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

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, role, switchRole, logout } = useAuth()

  const isDoctor = role === "doctor"
  const currentUser = user || (isDoctor ? DEMO_USERS.doctor : DEMO_USERS.organizer)

  const navLinks = isDoctor
    ? [
        {
          name: "Physician Workstation",
          href: "/dashboard",
          icon: Stethoscope,
        },
        {
          name: "My Patient Queue",
          href: "/transactions",
          icon: Calendar,
        },
        {
          name: "Telehealth Video Room",
          href: "/consultation",
          icon: Video,
        },
        {
          name: "Specialists Roster",
          href: "/accounts",
          icon: UserCheck,
        },
        {
          name: "Clinical Analytics",
          href: "/analytics",
          icon: LineChart,
        },
        {
          name: "Doctor Profile & Schedule",
          href: "/settings",
          icon: Settings,
        },
      ]
    : [
        {
          name: "Clinic Operations",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: "Appointment Queue",
          href: "/transactions",
          icon: Calendar,
        },
        {
          name: "Physician Roster",
          href: "/accounts",
          icon: UserCheck,
        },
        {
          name: "Patient Admissions",
          href: "/payments",
          icon: Activity,
        },
        {
          name: "Clinical Analytics",
          href: "/analytics",
          icon: LineChart,
        },
        {
          name: "Facility Settings",
          href: "/settings",
          icon: Settings,
        },
      ]

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

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
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight text-sidebar-foreground block">
              {APP_NAME}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground block -mt-0.5">
              {isDoctor ? "Physician Workstation" : "Hospital Operations"}
            </span>
          </div>
        </Link>
      </div>

      {/* Hospital Unit / Clinical Department Pill */}
      <div className="px-4 py-3 border-b border-sidebar-border/60">
        <div className="flex items-center justify-between p-2 rounded-lg bg-sidebar-accent/50 border border-sidebar-border/40">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
              {isDoctor ? <Stethoscope className="h-3.5 w-3.5" /> : <Building2 className="h-3.5 w-3.5" />}
            </div>
            <div className="truncate text-left">
              <p className="text-xs font-medium text-sidebar-foreground truncate">
                {isDoctor ? "West Cardiac Wing" : "Main Clinic Operations"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {isDoctor ? "Exam Room 402B" : "Operations Suite 100"}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`text-[10px] py-0 px-1.5 font-normal shrink-0 capitalize ${
              isDoctor
                ? "border-primary/40 text-primary bg-primary/10"
                : "border-teal-500/40 text-teal-600 bg-teal-500/10"
            }`}
          >
            {isDoctor ? "Doctor" : "Admin"}
          </Badge>
        </div>
      </div>

      {/* Quick Nav to Public Patient Booking */}
      <div className="px-4 pt-3 pb-1">
        <Link
          href="/book"
          className="flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <span className="flex items-center gap-1.5 font-semibold">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Book Consultation</span>
          </span>
          <ExternalLink className="h-3 w-3 opacity-70" />
        </Link>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="px-3 mb-2 flex items-center justify-between">
          <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase font-mono">
            {isDoctor ? "Clinical Care" : "Administration"}
          </p>
          <span className="text-[10px] font-mono text-primary font-bold">
            {isDoctor ? "Doctor Mode" : "Admin Mode"}
          </span>
        </div>
        {navLinks.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`))
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

      {/* Role Switcher Quick Pill inside Sidebar */}
      <div className="px-3 py-2">
        <button
          type="button"
          onClick={() => switchRole(isDoctor ? "organizer" : "doctor")}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-mono transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5 font-semibold">
            <ArrowRightLeft className="h-3 w-3" />
            <span>Switch to {isDoctor ? "Admin" : "Doctor"}</span>
          </span>
          <Badge variant="outline" className="text-[9px] py-0 px-1 border-primary/30">
            Demo
          </Badge>
        </button>
      </div>

      {/* Accreditation Status Card */}
      <div className="p-3.5 mx-3 mb-2 rounded-lg border border-sidebar-border bg-sidebar-accent/30 text-xs">
        <div className="flex items-center gap-1.5 text-emerald-600 font-medium mb-1">
          <ShieldCheck className="h-4 w-4" />
          <span>HIPAA & JCAHO Certified</span>
        </div>
        <p className="text-muted-foreground text-[10px] leading-relaxed">
          {isDoctor ? "Assigned clinical encounters encrypted under AES-256." : "Hospital operational records encrypted under HIPAA protocol."}
        </p>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-sidebar-border flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 w-full p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-left group cursor-pointer">
              <Avatar className="h-8 w-8 rounded-full border border-sidebar-border">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-sidebar-foreground truncate">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {currentUser.roleTitle}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-sidebar-foreground transition-colors shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-medium leading-none">{currentUser.name}</p>
                <p className="text-[11px] leading-none text-muted-foreground font-mono">
                  {currentUser.email}
                </p>
                <Badge variant="outline" className="w-fit text-[9px] font-mono capitalize border-primary/30 text-primary mt-1">
                  {isDoctor ? "Attending Physician" : "Hospital Administrator"}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => switchRole(isDoctor ? "organizer" : "doctor")}
              className="cursor-pointer text-xs font-medium"
            >
              <ArrowRightLeft className="mr-2 h-3.5 w-3.5 text-primary" />
              <span>Switch to {isDoctor ? "Hospital Admin" : "Doctor Workstation"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer text-xs">
                <User className="mr-2 h-3.5 w-3.5" />
                <span>{isDoctor ? "Doctor Profile & Schedule" : "Facility Settings"}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/portal" className="cursor-pointer text-xs">
                <Calendar className="mr-2 h-3.5 w-3.5" />
                <span>Patient Portal Preview</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-xs text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              <span>Sign Out of Terminal</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
