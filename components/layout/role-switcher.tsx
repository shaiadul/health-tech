"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth, UserRole, DEMO_USERS } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  User,
  Stethoscope,
  Building2,
  Check,
  ChevronDown,
  LogOut,
  Sparkles,
} from "lucide-react"

interface RoleSwitcherProps {
  variant?: "compact" | "full"
  className?: string
}

export function RoleSwitcher({ variant = "compact", className }: RoleSwitcherProps) {
  const { user, role, switchRole, logout } = useAuth()
  const router = useRouter()

  const handleSelectRole = (newRole: UserRole) => {
    switchRole(newRole)
    if (newRole === "organizer") {
      router.push("/dashboard")
    } else if (newRole === "doctor") {
      router.push("/portal?role=doctor")
    } else {
      router.push("/portal")
    }
  }

  const roleMeta = {
    patient: {
      label: "Patient",
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
      icon: User,
      target: "Patient Care Portal",
    },
    doctor: {
      label: "Physician",
      color: "bg-primary/10 text-primary border-primary/30",
      icon: Stethoscope,
      target: "Doctor Workstation",
    },
    organizer: {
      label: "Organizer",
      color: "bg-amber-500/10 text-amber-600 border-amber-500/30",
      icon: Building2,
      target: "Clinic Operations",
    },
  }

  const currentMeta = roleMeta[role] || roleMeta.patient
  const Icon = currentMeta.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer hover:bg-muted/50 ${currentMeta.color} ${className}`}
        >
          <Icon className="h-3.5 w-3.5 shrink-0" />
          <span className="font-semibold">{currentMeta.label}:</span>
          <span className="max-w-[100px] truncate text-foreground font-medium hidden sm:inline">
            {user?.name.split(" ")[0]}
          </span>
          <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-2 bg-card border-border shadow-xl rounded-2xl">
        <DropdownMenuLabel className="text-xs font-mono text-muted-foreground uppercase px-2 py-1">
          Switch Platform Role
        </DropdownMenuLabel>

        {/* Patient option */}
        <DropdownMenuItem
          onClick={() => handleSelectRole("patient")}
          className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer hover:bg-muted"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Patient Portal</p>
              <p className="text-[10px] text-muted-foreground">{DEMO_USERS.patient.name}</p>
            </div>
          </div>
          {role === "patient" && <Check className="h-4 w-4 text-emerald-600" />}
        </DropdownMenuItem>

        {/* Doctor option */}
        <DropdownMenuItem
          onClick={() => handleSelectRole("doctor")}
          className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer hover:bg-muted"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Stethoscope className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Doctor Station</p>
              <p className="text-[10px] text-muted-foreground">{DEMO_USERS.doctor.name.split(",")[0]}</p>
            </div>
          </div>
          {role === "doctor" && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>

        {/* Organizer option */}
        <DropdownMenuItem
          onClick={() => handleSelectRole("organizer")}
          className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer hover:bg-muted"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Clinic Organizer</p>
              <p className="text-[10px] text-muted-foreground">Operations & Triage Dashboard</p>
            </div>
          </div>
          {role === "organizer" && <Check className="h-4 w-4 text-amber-600" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1.5" />

        <div className="p-1">
          <Link
            href="/login"
            className="flex items-center gap-2 p-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Login Screen & All Roles</span>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
