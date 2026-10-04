"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth, DEMO_USERS } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RescheduleDialog } from "./reschedule-dialog"
import { CancelDialog } from "./cancel-dialog"
import { RefillDialog, MedicationItem } from "./refill-dialog"
import { PortalAuthGate } from "@/features/auth/components/portal-auth-gate"
import { Appointment } from "@/types/appointment"
import {
  Calendar,
  Clock,
  Video,
  PlusCircle,
  ArrowRight,
  RotateCcw,
  X,
  CheckCircle2,
  FileText,
  Activity,
  Users,
  Pill,
  LogOut,
  Stethoscope,
  Building2,
} from "lucide-react"

interface PortalViewProps {
  initialUpcoming: Appointment[]
  initialPast: Appointment[]
}

const INITIAL_MEDICATIONS: MedicationItem[] = [
  {
    id: "med_1",
    name: "Atorvastatin Calcium",
    dosage: "20 mg Oral Tablet",
    frequency: "Once daily at bedtime",
    refillsRemaining: 2,
    prescribedBy: "Dr. Sarah Ahmed, MD",
    rxNumber: "RX-884102",
  },
  {
    id: "med_2",
    name: "Lisinopril",
    dosage: "10 mg Oral Tablet",
    frequency: "Once daily each morning",
    refillsRemaining: 1,
    prescribedBy: "Dr. Sarah Ahmed, MD",
    rxNumber: "RX-772910",
  },
  {
    id: "med_3",
    name: "Metformin HCl",
    dosage: "500 mg Extended Release",
    frequency: "Twice daily with meals",
    refillsRemaining: 3,
    prescribedBy: "Dr. Marcus Vance, MD",
    rxNumber: "RX-991204",
  },
]

export function PortalView({
  initialUpcoming,
  initialPast,
}: PortalViewProps) {
  const router = useRouter()
  const { role, user, isAuthenticated, logout } = useAuth()

  const [upcoming, setUpcoming] = React.useState<Appointment[]>(initialUpcoming)
  const [past, setPast] = React.useState<Appointment[]>(initialPast)
  const [medications, setMedications] = React.useState<MedicationItem[]>(INITIAL_MEDICATIONS)

  const [activeRescheduleApt, setActiveRescheduleApt] = React.useState<Appointment | null>(null)
  const [activeCancelApt, setActiveCancelApt] = React.useState<Appointment | null>(null)
  const [activeRefillMed, setActiveRefillMed] = React.useState<MedicationItem | null>(null)
  const [refillSuccessNotice, setRefillSuccessNotice] = React.useState<string | null>(null)

  // /portal is ONLY for customer/patient login.
  // If doctor or organizer accesses /portal, automatically redirect to their clinical panel.
  React.useEffect(() => {
    if (isAuthenticated) {
      if (role === "doctor") {
        router.replace("/consultation")
      } else if (role === "organizer") {
        router.replace("/dashboard")
      }
    }
  }, [isAuthenticated, role, router])

  // Unauthenticated Gate for customers
  if (!isAuthenticated) {
    return <PortalAuthGate />
  }

  // Doctor or Organizer redirect fallback screen
  if (role !== "patient") {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center animate-pulse">
          {role === "doctor" ? <Stethoscope className="h-7 w-7" /> : <Building2 className="h-7 w-7" />}
        </div>
        <h2 className="text-xl font-bold text-foreground">
          {role === "doctor" ? "Redirecting to Physician Workstation..." : "Redirecting to Operations Panel..."}
        </h2>
        <p className="text-xs text-muted-foreground font-mono">
          Customer Portal is reserved for patients. Medical staff are redirected to their designated clinical panels.
        </p>
      </div>
    )
  }

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

  const handleRefillSuccess = (medId: string) => {
    const med = medications.find((m) => m.id === medId)
    if (med) {
      setRefillSuccessNotice(`Refill request for ${med.name} transmitted successfully!`)
      setTimeout(() => setRefillSuccessNotice(null), 4000)
    }
  }

  const nextAppointment = upcoming[0]

  return (
    <div className="space-y-10">
      {/* 1. Header with Customer Profile & Sign Out */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl border border-border bg-card shadow-xs">
        <div className="flex items-center gap-3.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user?.avatar || DEMO_USERS.patient.avatar}
            alt={user?.name || "Customer Avatar"}
            className="w-13 h-13 rounded-2xl object-cover ring-2 ring-primary/20 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                Customer Care Portal
              </span>
              <Badge variant="outline" className="text-[10px] font-mono capitalize border-emerald-500/30 text-emerald-600 bg-emerald-500/5">
                Verified Patient
              </Badge>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Session Active" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Welcome back, {user?.name}
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Patient ID: {user?.patientId || "PT-89241"} · Blood Type: {user?.bloodType || "O-Positive"} · Allergies: {user?.allergies?.join(", ") || "None"}
            </p>
          </div>
        </div>

        {/* Sign Out Action */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="h-9 px-3.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 border-border gap-1.5 rounded-xl cursor-pointer"
            title="Log out of current session"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Refill Success Banner */}
      {refillSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{refillSuccessNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setRefillSuccessNotice(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 2. CUSTOMER / PATIENT PORTAL BODY */}
      <div className="space-y-10">
        {/* Upcoming Appointment Showcase */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Next Scheduled Doctor Visit</span>
            </h2>
            <span className="text-xs font-mono text-muted-foreground">
              {upcoming.length} active booking{upcoming.length === 1 ? "" : "s"}
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
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                        {nextAppointment.serviceTitle}
                      </Badge>
                      {nextAppointment.consultationType === "video" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Live Telehealth Room
                        </span>
                      )}
                    </div>
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
                    className="h-11 px-6 rounded-xl font-semibold gap-2 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
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

        {/* Interactive Vitals & Health Biometrics */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-500" />
              <span>Personal Health Vitals & Telemetry</span>
            </h2>
            <span className="text-[11px] font-mono text-muted-foreground">
              Synced with Apple Health · Today, 8:45 AM
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
              <span className="text-muted-foreground block text-[10px] uppercase">Blood Pressure</span>
              <span className="text-2xl font-bold text-foreground">118 / 76</span>
              <span className="text-emerald-600 block text-[11px] font-semibold">Optimal Range</span>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
              <span className="text-muted-foreground block text-[10px] uppercase">Resting Heart Rate</span>
              <span className="text-2xl font-bold text-foreground">72 BPM</span>
              <span className="text-emerald-600 block text-[11px] font-semibold">Normal Sinus Rhythm</span>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
              <span className="text-muted-foreground block text-[10px] uppercase">Blood Oxygen (SpO2)</span>
              <span className="text-2xl font-bold text-primary">99 %</span>
              <span className="text-primary block text-[11px] font-semibold">Normal Saturation</span>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
              <span className="text-muted-foreground block text-[10px] uppercase">Fasting Blood Glucose</span>
              <span className="text-2xl font-bold text-foreground">94 mg/dL</span>
              <span className="text-emerald-600 block text-[11px] font-semibold">Euglycemic</span>
            </div>
          </div>
        </section>

        {/* Active Prescriptions & Refill Pad */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                <span>Active E-Prescriptions & Pharmacy Refills</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Verified medications on file with direct electronic pharmacy refill requests
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {medications.map((med) => (
              <div
                key={med.id}
                className="p-5 rounded-2xl border border-border bg-card flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono text-primary uppercase font-bold">
                      {med.rxNumber}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {med.refillsRemaining} Refills Left
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-foreground">
                      {med.name}
                    </h4>
                    <p className="text-xs text-muted-foreground font-mono">
                      {med.dosage}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground pt-1">
                    Instructions: <span className="text-foreground">{med.frequency}</span>
                  </p>

                  <p className="text-[11px] text-muted-foreground font-mono">
                    Prescribed by {med.prescribedBy}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveRefillMed(med)}
                  className="w-full text-xs font-semibold rounded-xl gap-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Request Refill</span>
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Past Clinical Records */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2 border-b border-border pb-3">
            <FileText className="h-5 w-5 text-primary" />
            <span>Past Clinical Consultations & Visit Records</span>
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

                  <Button asChild variant="outline" size="sm" className="text-xs h-8 rounded-lg gap-1">
                    <Link href={`/consultation/${apt.referenceNumber.toLowerCase()}`}>
                      <FileText className="h-3 w-3" />
                      <span>View Notes</span>
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Personal Care Specialists */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2 border-b border-border pb-3">
            <Users className="h-5 w-5 text-primary" />
            <span>Your Designated MedPulse Care Team</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-border bg-card flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DEMO_USERS.doctor.avatar}
                alt={DEMO_USERS.doctor.name}
                className="w-14 h-14 rounded-2xl object-cover ring-1 ring-border"
              />
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-foreground">
                  {DEMO_USERS.doctor.name}
                </h4>
                <p className="text-xs text-primary font-mono">
                  Attending Cardiologist
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Next visit: Today at 3:30 PM (Video Room)
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-border bg-card flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DEMO_USERS.organizer.avatar}
                alt={DEMO_USERS.organizer.name}
                className="w-14 h-14 rounded-2xl object-cover ring-1 ring-border"
              />
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-foreground">
                  {DEMO_USERS.organizer.name}
                </h4>
                <p className="text-xs text-primary font-mono">
                  Primary Care & Internal Medicine
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Routine annual wellness exam scheduled next quarter
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Interactive Prescription Refill Dialog */}
      {activeRefillMed && (
        <RefillDialog
          medication={activeRefillMed}
          open={!!activeRefillMed}
          onClose={() => setActiveRefillMed(null)}
          onSuccess={handleRefillSuccess}
        />
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
