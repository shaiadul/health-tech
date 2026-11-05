"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth, DEMO_USERS } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { RescheduleDialog } from "./reschedule-dialog"
import { CancelDialog } from "./cancel-dialog"
import { RefillDialog, MedicationItem } from "./refill-dialog"
import { PortalAuthGate } from "@/features/auth/components/portal-auth-gate"
import { Appointment } from "@/types/appointment"
import {
  Calendar,
  Video,
  Plus,
  RotateCcw,
  X,
  CheckCircle2,
  FileText,
  Activity,
  HeartPulse,
  Pill,
  LogOut,
  Stethoscope,
  Building2,
  PhoneCall,
  Clock,
  ArrowRight,
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
  const [medications] = React.useState<MedicationItem[]>(INITIAL_MEDICATIONS)

  const [activeRescheduleApt, setActiveRescheduleApt] = React.useState<Appointment | null>(null)
  const [activeCancelApt, setActiveCancelApt] = React.useState<Appointment | null>(null)
  const [activeRefillMed, setActiveRefillMed] = React.useState<MedicationItem | null>(null)
  const [refillSuccessNotice, setRefillSuccessNotice] = React.useState<string | null>(null)

  // Redirect non-patient roles (doctors/admins) to their operational workspace
  React.useEffect(() => {
    if (isAuthenticated) {
      if (role === "doctor") {
        router.replace("/consultation")
      } else if (role === "organizer") {
        router.replace("/dashboard")
      }
    }
  }, [isAuthenticated, role, router])

  if (!isAuthenticated) {
    return <PortalAuthGate />
  }

  if (role !== "patient") {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto">
        <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary mx-auto flex items-center justify-center animate-pulse">
          {role === "doctor" ? <Stethoscope className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
        </div>
        <h2 className="text-lg font-bold text-foreground">
          {role === "doctor" ? "Redirecting to Physician Workstation..." : "Redirecting to Operations Panel..."}
        </h2>
        <p className="text-xs text-muted-foreground">
          Medical staff are automatically redirected to their clinical workstations.
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
      setRefillSuccessNotice(`Refill request for ${med.name} sent to pharmacy.`)
      setTimeout(() => setRefillSuccessNotice(null), 4000)
    }
  }

  const nextAppointment = upcoming[0]
  const patientName = user?.name || DEMO_USERS.patient.name
  const patientId = user?.patientId || DEMO_USERS.patient.patientId || "PT-89241"
  const bloodType = user?.bloodType || DEMO_USERS.patient.bloodType || "O-Positive"
  const allergies = user?.allergies || DEMO_USERS.patient.allergies || ["Penicillin", "Sulfa drugs"]

  return (
    <div className="w-full space-y-8">
      {/* 1. Header Profile & Primary Patient Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user?.avatar || DEMO_USERS.patient.avatar}
            alt={patientName}
            className="w-14 h-14 rounded-2xl object-cover ring-1 ring-border shrink-0"
          />
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {patientName}
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Patient ID: {patientId} · Blood Type: {bloodType} · Allergies: {allergies.join(", ")}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <Button
            asChild
            size="sm"
            className="h-9 px-4 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 shadow-2xs"
          >
            <Link href="/book">
              <Plus className="h-3.5 w-3.5" />
              <span>Book Appointment</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground border-border rounded-xl gap-1.5 cursor-pointer"
            title="Sign out of patient portal"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Refill Feedback Notice */}
      {refillSuccessNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{refillSuccessNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setRefillSuccessNotice(null)}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 2. Main Portal Grid (Core Agenda + Client Assist Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Content Area (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Next Scheduled Consultation (Primary Client Agenda) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Next Scheduled Visit</span>
              </h2>
              {upcoming.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {upcoming.length} active appointment{upcoming.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {nextAppointment ? (
              <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={nextAppointment.specialistAvatar}
                      alt={nextAppointment.specialistName}
                      className="h-12 w-12 rounded-xl object-cover ring-1 ring-border shrink-0"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-foreground">
                        {nextAppointment.specialistName}
                      </h3>
                      <p className="text-xs text-primary font-medium">
                        {nextAppointment.specialistTitle}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Reason: <span className="text-foreground">{nextAppointment.customer.reason}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-xs space-y-0.5 shrink-0 bg-muted/40 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                    <p className="font-semibold text-foreground">
                      {nextAppointment.dateFormatted}
                    </p>
                    <p className="text-primary font-medium">
                      {nextAppointment.time} ({nextAppointment.durationMinutes} mins)
                    </p>
                    <p className="text-muted-foreground">
                      {nextAppointment.consultationType === "video"
                        ? "Telehealth Video Consultation"
                        : nextAppointment.locationAddress}
                    </p>
                  </div>
                </div>

                {/* Consultation Actions */}
                <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-border">
                  {nextAppointment.consultationType === "video" && (
                    <Button
                      asChild
                      className="h-10 px-5 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-xs cursor-pointer"
                    >
                      <Link href={nextAppointment.meetingLink || `/consultation/${nextAppointment.referenceNumber.toLowerCase()}`}>
                        <Video className="h-4 w-4" />
                        <span>Join Video Consultation Room</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveRescheduleApt(nextAppointment)}
                    className="h-10 px-3.5 text-xs border-border rounded-xl gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Reschedule</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveCancelApt(nextAppointment)}
                    className="h-10 px-3 text-xs text-muted-foreground hover:text-destructive rounded-xl gap-1.5 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Cancel</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-border bg-card/60 text-center space-y-2.5">
                <p className="text-sm font-semibold text-foreground">No upcoming consultations</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  You do not have any appointments scheduled with your care team.
                </p>
                <Button asChild size="sm" className="h-9 px-4 text-xs rounded-xl mt-2">
                  <Link href="/book">Book New Consultation</Link>
                </Button>
              </div>
            )}
          </section>

          {/* Active Prescriptions & Pharmacy Refill Pad */}
          <section className="space-y-3">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Pill className="h-4 w-4 text-primary" />
                <span>Active Prescriptions & Pharmacy Refills</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Verified medications on record. Click below to submit refill requests directly to your pharmacy.
              </p>
            </div>

            <div className="divide-y divide-border border border-border rounded-2xl bg-card overflow-hidden">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/15 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-foreground">
                        {med.name}
                      </h4>
                      <span className="text-xs font-mono text-muted-foreground">
                        ({med.dosage})
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Directions: <span className="text-foreground">{med.frequency}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      Rx: {med.rxNumber} · Prescribed by {med.prescribedBy} · {med.refillsRemaining} refills remaining
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveRefillMed(med)}
                    className="h-9 px-3.5 text-xs border-border rounded-xl gap-1.5 shrink-0 hover:border-primary cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-primary" />
                    <span>Request Refill</span>
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* Past Consultation Records & EHR Clinical Notes */}
          <section className="space-y-3">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>Past Clinical Consultations & Notes</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Historical clinic encounters and physician consultation notes.
              </p>
            </div>

            <div className="divide-y divide-border border border-border rounded-2xl bg-card overflow-hidden">
              {past.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/15 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">
                        {apt.specialistName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        · {apt.serviceTitle}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {apt.dateFormatted} at {apt.time}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      &ldquo;{apt.customer.reason}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-mono capitalize ${
                      apt.status === "completed" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                    }`}>
                      {apt.status}
                    </span>

                    <Button asChild variant="outline" size="sm" className="h-8 text-xs border-border rounded-lg gap-1">
                      <Link href={`/consultation/${apt.referenceNumber.toLowerCase()}`}>
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <span>Visit Notes</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Client Assist & Support Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Recent Clinical Vitals */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase font-mono tracking-wider">
                <Activity className="h-3.5 w-3.5 text-primary" />
                <span>Recent Clinical Vitals</span>
              </h3>
              <span className="text-[10px] text-muted-foreground font-mono">
                Last Clinic Check
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-muted/30 border border-border/70 space-y-0.5">
                <span className="text-muted-foreground text-[10px] block font-mono">Blood Pressure</span>
                <span className="text-base font-bold text-foreground block">118 / 76</span>
                <span className="text-[10px] text-emerald-600 block">Normal</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/30 border border-border/70 space-y-0.5">
                <span className="text-muted-foreground text-[10px] block font-mono">Heart Rate</span>
                <span className="text-base font-bold text-foreground block">72 bpm</span>
                <span className="text-[10px] text-emerald-600 block">Resting</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/30 border border-border/70 space-y-0.5">
                <span className="text-muted-foreground text-[10px] block font-mono">Oxygen (SpO2)</span>
                <span className="text-base font-bold text-primary block">99 %</span>
                <span className="text-[10px] text-primary block">Optimal</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/30 border border-border/70 space-y-0.5">
                <span className="text-muted-foreground text-[10px] block font-mono">Blood Glucose</span>
                <span className="text-base font-bold text-foreground block">94 mg/dL</span>
                <span className="text-[10px] text-emerald-600 block">Fasting</span>
              </div>
            </div>
          </div>

          {/* Designated Care Team */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-3 shadow-xs">
            <div className="pb-2 border-b border-border">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase font-mono tracking-wider">
                <Stethoscope className="h-3.5 w-3.5 text-primary" />
                <span>Your Designated Care Team</span>
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={DEMO_USERS.doctor.avatar}
                  alt={DEMO_USERS.doctor.name}
                  className="w-11 h-11 rounded-xl object-cover ring-1 ring-border shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-foreground truncate">
                    {DEMO_USERS.doctor.name}
                  </h4>
                  <p className="text-[11px] text-primary">
                    Cardiology & Heart Health
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Next visit: Today at 3:30 PM
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-border/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={DEMO_USERS.organizer.avatar}
                  alt={DEMO_USERS.organizer.name}
                  className="w-11 h-11 rounded-xl object-cover ring-1 ring-border shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-foreground truncate">
                    {DEMO_USERS.organizer.name}
                  </h4>
                  <p className="text-[11px] text-primary">
                    Primary Care & Internal Medicine
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Annual wellness scheduled
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Client Assist & Support Card */}
          <div className="p-5 rounded-2xl border border-border bg-muted/20 space-y-3">
            <h3 className="text-xs font-bold text-foreground uppercase font-mono tracking-wider flex items-center gap-1.5">
              <PhoneCall className="h-3.5 w-3.5 text-primary" />
              <span>Patient Assistance & Support</span>
            </h3>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              Need assistance with your appointments, prescriptions, or video visits? Our clinical desk is available to assist you.
            </p>

            <div className="p-3 rounded-xl bg-card border border-border text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Hospital Hotline:</span>
                <span className="font-bold text-foreground">+1 (800) 432-5847</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Desk Hours:</span>
                <span className="text-muted-foreground">Mon – Fri, 8am – 7pm EST</span>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground pt-1">
              For acute emergencies or chest pain, please dial 911 or visit the nearest emergency room immediately.
            </p>
          </div>

        </div>

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
