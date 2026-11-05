"use client"

import * as React from "react"
import { useAuth, UserRole } from "@/lib/auth-context"
import { Appointment } from "@/types/appointment"
import { Specialist } from "@/types/specialist"
import { ClinicAdminView } from "./clinic-admin-view"
import { DoctorWorkstationView } from "./doctor-workstation-view"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Stethoscope,
  ArrowRightLeft,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

interface DashboardRoleViewProps {
  initialAppointments: Appointment[]
  doctors: Specialist[]
}

export function DashboardRoleView({
  initialAppointments,
  doctors,
}: DashboardRoleViewProps) {
  const { role, user, switchRole } = useAuth()

  // Ensure role is either organizer or doctor for dashboard
  const isDoctorRole = role === "doctor"

  return (
    <div className="space-y-6">
      {/* Interactive Role Switcher & Context Bar */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-card to-primary/5 border border-primary/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs">
            {isDoctorRole ? <Stethoscope className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-bold">
                Active Staff Perspective:
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] font-mono capitalize ${
                  isDoctorRole
                    ? "border-primary/40 text-primary bg-primary/10"
                    : "border-teal-500/40 text-teal-700 dark:text-teal-300 bg-teal-500/10"
                }`}
              >
                {isDoctorRole ? "Physician Workstation Mode" : "Hospital Management Mode"}
              </Badge>
            </div>
            <p className="text-xs text-foreground font-semibold mt-0.5">
              Signed in as {user?.name || (isDoctorRole ? "Dr. Sarah Ahmed, MD" : "Dr. Marcus Vance, MD")} · {user?.department || (isDoctorRole ? "Cardiology & Heart Health" : "Clinical Facility Operations")}
            </p>
          </div>
        </div>

        {/* 1-Click Role Switcher Button */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <span className="text-xs text-muted-foreground font-mono hidden sm:inline">
            Role Demo Toggle:
          </span>
          {isDoctorRole ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => switchRole("organizer")}
              className="h-9 px-3 text-xs font-mono border-primary/40 text-primary hover:bg-primary/10 rounded-xl gap-2 cursor-pointer shadow-2xs"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              <span>Switch to Hospital Admin View</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => switchRole("doctor")}
              className="h-9 px-3 text-xs font-mono border-primary/40 text-primary hover:bg-primary/10 rounded-xl gap-2 cursor-pointer shadow-2xs"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              <span>Switch to Doctor View</span>
            </Button>
          )}
        </div>
      </div>

      {/* Render Role Specific Dashboard */}
      {isDoctorRole ? (
        <DoctorWorkstationView appointments={initialAppointments} />
      ) : (
        <ClinicAdminView
          initialAppointments={initialAppointments}
          doctors={doctors}
        />
      )}
    </div>
  )
}

