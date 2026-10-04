"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAuth, UserRole, DEMO_USERS } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RescheduleDialog } from "./reschedule-dialog"
import { CancelDialog } from "./cancel-dialog"
import { Appointment } from "@/types/appointment"
import { RoleSwitcher } from "@/components/layout/role-switcher"
import {
  Calendar,
  Clock,
  Video,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  X,
  Building,
  CheckCircle2,
  FileText,
  Activity,
  User,
  Stethoscope,
  Building2,
  Users,
  ShieldCheck,
  Phone,
  AlertCircle,
  Pill,
} from "lucide-react"

interface PortalViewProps {
  initialUpcoming: Appointment[]
  initialPast: Appointment[]
}

export function PortalView({
  initialUpcoming,
  initialPast,
}: PortalViewProps) {
  const searchParams = useSearchParams()
  const { role, switchRole, user } = useAuth()

  // Support URL param ?role=doctor or ?role=organizer
  const roleParam = searchParams.get("role") as UserRole | null
  React.useEffect(() => {
    if (roleParam && (roleParam === "doctor" || roleParam === "organizer" || roleParam === "patient")) {
      switchRole(roleParam)
    }
  }, [roleParam, switchRole])

  const [upcoming, setUpcoming] = React.useState<Appointment[]>(initialUpcoming)
  const [past, setPast] = React.useState<Appointment[]>(initialPast)

  const [activeRescheduleApt, setActiveRescheduleApt] = React.useState<Appointment | null>(null)
  const [activeCancelApt, setActiveCancelApt] = React.useState<Appointment | null>(null)

  const handleRescheduled = (updated: Appointment) => {
    setUpcoming((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    )
  }

  const handleCancelled = (id: string) => {
    const target = upcoming.find((item) => item.id === id)
    if (target) {
      setUpcoming((prev) => prev.filter((item) => item.id !== id))
      setPast((prev) => [{ ...target, status: "cancelled" }, ...prev])
    }
  }

  const nextAppointment = upcoming[0]

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-6">
      {/* 1. Header with Role Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl border border-border bg-card shadow-xs">
        <div className="flex items-center gap-3.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user?.avatar || DEMO_USERS[role].avatar}
            alt={user?.name || "User Avatar"}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-primary/20 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                {role === "doctor"
                  ? "Physician Workstation"
                  : role === "organizer"
                  ? "Clinic Organizer & Administration"
                  : "Patient Care Portal"}
              </span>
              <Badge variant="outline" className="text-[10px] font-mono capitalize">
                {role}
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Welcome, {user?.name || "Alex Mercer"}
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              {role === "doctor"
                ? `Staff ID: MD-1029 · ${DEMO_USERS.doctor.department}`
                : role === "organizer"
                ? "Hospital Facility ID: MED-CENTRAL · 24/7 Operations"
                : `Patient ID: ${DEMO_USERS.patient.patientId} · Primary Physician: Dr. Sarah Ahmed, MD`}
            </p>
          </div>
        </div>

        {/* Quick Role Switcher Pill Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-mono text-muted-foreground hidden md:inline">
            Active Role:
          </span>
          <RoleSwitcher />
        </div>
      </div>

      {/* 2. ROLE-BASED PORTAL BODY */}

      {/* ========================================================
          ROLE 1: PATIENT PORTAL VIEW
          ======================================================== */}
      {role === "patient" && (
        <div className="space-y-8">
          {/* Upcoming Appointment Showcase */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Next Scheduled Doctor Visit</span>
              </h2>
              <span className="text-xs font-mono text-muted-foreground">
                {upcoming.length} active bookings
              </span>
            </div>

            {nextAppointment ? (
              <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex items-start gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={nextAppointment.specialistAvatar}
                      alt={nextAppointment.specialistName}
                      className="h-16 w-16 rounded-2xl object-cover ring-1 ring-border shrink-0"
                    />
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                        {nextAppointment.serviceTitle}
                      </Badge>
                      <h3 className="text-2xl font-bold text-foreground">
                        {nextAppointment.specialistName}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {nextAppointment.specialistTitle}
                      </p>
                      <p className="text-xs text-muted-foreground pt-1">
                        Reason: <span className="italic text-foreground">{nextAppointment.customer.reason}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted/40 border border-border font-mono text-xs md:text-right space-y-1 shrink-0">
                    <p className="text-base font-bold text-foreground">
                      {nextAppointment.dateFormatted}
                    </p>
                    <p className="text-primary font-semibold">
                      {nextAppointment.time} ({nextAppointment.durationMinutes} mins)
                    </p>
                    <p className="text-muted-foreground text-[11px] capitalize">
                      {nextAppointment.consultationType === "video"
                        ? "Encrypted Telehealth HD Video"
                        : nextAppointment.locationAddress}
                    </p>
                  </div>
                </div>

                {/* Direct Action Strip */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
                  {nextAppointment.consultationType === "video" && (
                    <Button
                      asChild
                      className="h-11 px-6 rounded-xl font-semibold gap-2 shadow-sm"
                    >
                      <Link href={nextAppointment.meetingLink || `/consultation/${nextAppointment.referenceNumber.toLowerCase()}`}>
                        <Video className="h-4 w-4" />
                        <span>Enter Video Consultation Room</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => setActiveRescheduleApt(nextAppointment)}
                    className="h-11 px-4 text-xs font-semibold rounded-xl gap-2"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reschedule</span>
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setActiveCancelApt(nextAppointment)}
                    className="h-11 px-4 text-xs text-muted-foreground hover:text-destructive rounded-xl gap-2"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Cancel</span>
                  </Button>

                  <Button asChild variant="outline" className="h-11 px-4 text-xs ml-auto rounded-xl">
                    <Link href="/book">
                      <PlusCircle className="h-4 w-4 mr-1.5" />
                      <span>Book Another Visit</span>
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-10 rounded-3xl border border-dashed border-border bg-card/60 text-center space-y-3">
                <Calendar className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-sm font-semibold text-foreground">No upcoming visits</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  You do not have any appointments scheduled right now.
                </p>
                <Button asChild size="sm" className="mt-2 text-xs rounded-xl">
                  <Link href="/book">Book Consultation Now</Link>
                </Button>
              </div>
            )}
          </section>

          {/* Past Clinical Records */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2 border-b border-border pb-3">
              <FileText className="h-4 w-4 text-primary" />
              <span>Past Clinical Consultations & Records</span>
            </h2>

            <div className="divide-y divide-border border border-border rounded-2xl bg-card overflow-hidden">
              {past.map((apt) => (
                <div key={apt.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{apt.specialistName}</span>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {apt.serviceTitle}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{apt.dateFormatted} · {apt.time}</p>
                    <p className="text-xs text-muted-foreground italic">&ldquo;{apt.customer.reason}&rdquo;</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={apt.status === "completed" ? "secondary" : "destructive"} className="capitalize text-xs font-mono">
                      {apt.status}
                    </Badge>

                    <Button asChild variant="outline" size="sm" className="text-xs h-8 rounded-lg">
                      <Link href={`/consultation/${apt.referenceNumber.toLowerCase()}`}>
                        <span>View Notes</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ========================================================
          ROLE 2: DOCTOR WORKSTATION VIEW
          ======================================================== */}
      {role === "doctor" && (
        <div className="space-y-8">
          {/* Today's Inpatient & Telehealth Queue */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <span>Today&apos;s Patient Queue</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  3 patients waiting · 1 incoming telehealth video consultation
                </p>
              </div>

              <Button asChild size="sm" className="h-9 text-xs rounded-xl gap-1.5 font-semibold">
                <Link href="/consultation/MED-TELEHEALTH-LIVE">
                  <Video className="h-4 w-4" />
                  <span>Start Telehealth Room</span>
                </Link>
              </Button>
            </div>

            {/* Waiting Patient Active Card */}
            <div className="p-6 rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                      alt="Alex Mercer"
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary/40"
                    />
                    <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success" className="text-[10px] font-mono">
                        Waiting in Video Room
                      </Badge>
                      <span className="text-xs font-mono text-muted-foreground">
                        Connected 3m ago
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      Alex Mercer (Age 38, Male)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Chief Complaint: <span className="text-foreground font-medium">Exertional chest tightness & blood pressure review</span>
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono text-xs space-y-1">
                  <span className="block text-foreground font-bold">Scheduled: Today, 3:30 PM</span>
                  <span className="text-emerald-600 block">Vitals: BP 118/78 · HR 72 bpm</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border">
                <Button asChild className="h-11 px-6 text-xs font-semibold rounded-xl gap-2 shadow-md">
                  <Link href="/consultation/med-2026-9041">
                    <Video className="h-4 w-4" />
                    <span>Launch Video Consultation</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button variant="outline" className="h-11 px-4 text-xs font-medium rounded-xl gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>Open Patient EHR Chart</span>
                </Button>

                <Button variant="outline" className="h-11 px-4 text-xs font-medium rounded-xl gap-2">
                  <Pill className="h-4 w-4 text-primary" />
                  <span>Write E-Prescription</span>
                </Button>
              </div>
            </div>

            {/* Other queue patients */}
            <div className="divide-y divide-border border border-border rounded-2xl bg-card overflow-hidden">
              {[
                { name: "Eleanor Brooks", time: "4:15 PM", type: "In-Person Clinic", reason: "Follow-up echocardiogram review", status: "Checked In" },
                { name: "David Zhang", time: "5:00 PM", type: "Video Consultation", reason: "Hypertension medication titration", status: "Upcoming" },
              ].map((p, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between text-xs hover:bg-muted/20">
                  <div>
                    <span className="font-bold text-foreground block text-sm">{p.name}</span>
                    <span className="text-muted-foreground">{p.time} · {p.type} · {p.reason}</span>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {p.status}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ========================================================
          ROLE 3: CLINIC ORGANIZER & FACILITY ADMIN VIEW
          ======================================================== */}
      {role === "organizer" && (
        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-amber-500" />
                  <span>Hospital Operations Command</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Facility capacity, triage status, and active physician telemetry
                </p>
              </div>

              <Button asChild className="h-10 text-xs font-semibold rounded-xl gap-2">
                <Link href="/dashboard">
                  <span>Open Full Operations Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
                <span className="text-muted-foreground block text-[10px] uppercase">Active Outpatient Rooms</span>
                <span className="text-2xl font-bold text-foreground">18 / 24</span>
                <span className="text-emerald-600 block text-[11px]">75% Occupancy</span>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
                <span className="text-muted-foreground block text-[10px] uppercase">On-Duty Physicians</span>
                <span className="text-2xl font-bold text-primary">12 Specialists</span>
                <span className="text-muted-foreground block text-[11px]">Across 7 Departments</span>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
                <span className="text-muted-foreground block text-[10px] uppercase">Live Telehealth Sessions</span>
                <span className="text-2xl font-bold text-emerald-600">6 Connected</span>
                <span className="text-muted-foreground block text-[11px]">Avg Latency 24ms</span>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
                <span className="text-muted-foreground block text-[10px] uppercase">Triage Queue</span>
                <span className="text-2xl font-bold text-foreground">4 Waiting</span>
                <span className="text-emerald-600 block text-[11px]">Avg Wait 6 mins</span>
              </div>
            </div>

            {/* Department Load Table */}
            <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Clinical Department Status
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: "Cardiology Center", status: "Optimal", doctors: 3, queue: 2 },
                  { name: "Neurology Suite", status: "Optimal", doctors: 2, queue: 1 },
                  { name: "Pediatric Pavilion", status: "High Demand", doctors: 2, queue: 4 },
                ].map((dept, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-muted/20 border border-border text-xs space-y-1">
                    <span className="font-bold text-foreground block">{dept.name}</span>
                    <span className="text-muted-foreground block font-mono">
                      {dept.doctors} Physicians · {dept.queue} in Queue
                    </span>
                    <Badge variant={dept.status === "Optimal" ? "success" : "warning"} className="text-[10px]">
                      {dept.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Reschedule Dialog */}
      {activeRescheduleApt && (
        <RescheduleDialog
          appointment={activeRescheduleApt}
          open={!!activeRescheduleApt}
          onClose={() => setActiveRescheduleApt(null)}
          onRescheduled={(updated: Appointment) => {
            handleRescheduled(updated)
            setActiveRescheduleApt(null)
          }}
        />
      )}

      {/* Cancel Dialog */}
      {activeCancelApt && (
        <CancelDialog
          appointment={activeCancelApt}
          open={!!activeCancelApt}
          onClose={() => setActiveCancelApt(null)}
          onCancelled={(id: string) => {
            handleCancelled(id)
            setActiveCancelApt(null)
          }}
        />
      )}
    </div>
  )
}
