"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RescheduleDialog } from "./reschedule-dialog"
import { CancelDialog } from "./cancel-dialog"
import { Appointment } from "@/types/appointment"
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
} from "lucide-react"

interface PortalViewProps {
  initialUpcoming: Appointment[]
  initialPast: Appointment[]
}

export function PortalView({
  initialUpcoming,
  initialPast,
}: PortalViewProps) {
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
    <div className="space-y-12 max-w-4xl mx-auto py-8">
      
      {/* Simple Patient Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-primary font-semibold">
            <Activity className="h-4 w-4" />
            <span>MedPulse Patient Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Welcome, Alex
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-mono">
            Patient ID: <strong className="text-foreground">PT-89241</strong> · Assigned Doctor: <strong className="text-foreground">Dr. Sarah Ahmed, MD</strong>
          </p>
        </div>

        <Button
          asChild
          className="h-10 px-5 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold gap-2 self-start sm:self-auto"
        >
          <Link href="/book">
            <PlusCircle className="h-4 w-4" />
            <span>Book New Appointment</span>
          </Link>
        </Button>
      </div>

      {/* Primary Focus: Next Doctor Appointment */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-border pb-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Upcoming Doctor Visit</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-primary/10 text-primary">
              Confirmed
            </span>
          </h2>
          <span className="text-xs font-mono text-muted-foreground">
            {upcoming.length} scheduled
          </span>
        </div>

        {nextAppointment ? (
          <div className="p-6 sm:p-8 border border-border bg-background space-y-6">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold block">
                  {nextAppointment.serviceTitle}
                </span>
                <h3 className="text-2xl font-bold text-foreground">
                  {nextAppointment.specialistName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {nextAppointment.specialistTitle}
                </p>
              </div>

              <div className="font-mono text-xs text-left md:text-right space-y-1">
                <p className="text-lg font-bold text-foreground">
                  {nextAppointment.dateFormatted}
                </p>
                <p className="text-primary font-semibold">
                  {nextAppointment.time} ({nextAppointment.durationMinutes} mins)
                </p>
                <p className="text-muted-foreground text-[11px]">
                  {nextAppointment.consultationType === "video" ? "Telehealth Video Consultation" : nextAppointment.locationAddress}
                </p>
              </div>
            </div>

            {/* Direct Actions Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
              {nextAppointment.meetingLink && nextAppointment.consultationType === "video" && (
                <Button
                  asChild
                  className="h-10 px-5 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold gap-2"
                >
                  <a href={nextAppointment.meetingLink} target="_blank" rel="noreferrer">
                    <Video className="h-4 w-4" />
                    <span>Join Video Room</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => setActiveRescheduleApt(nextAppointment)}
                className="h-10 px-5 rounded-none border-border hover:border-primary text-xs font-semibold gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reschedule</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => setActiveCancelApt(nextAppointment)}
                className="h-10 px-4 rounded-none text-xs text-destructive hover:bg-destructive/10 font-semibold gap-1.5"
              >
                <X className="h-3.5 w-3.5" />
                <span>Cancel</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-8 border border-dashed border-border text-center space-y-3">
            <p className="text-sm text-muted-foreground">You have no upcoming doctor appointments scheduled.</p>
            <Button asChild size="sm" className="rounded-none text-xs">
              <Link href="/book">Book an Appointment Now</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Patient Past Consultations History */}
      <section className="space-y-4">
        <div className="border-b border-border pb-3 flex items-baseline justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Consultation History & Records
          </h2>
          <span className="text-xs font-mono text-muted-foreground">
            {past.length} previous visits
          </span>
        </div>

        <div className="divide-y divide-border border border-border">
          {past.map((apt) => (
            <div
              key={apt.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono hover:bg-muted/20 transition-colors"
            >
              <div className="space-y-1">
                <span className="font-bold text-foreground text-sm block">
                  {apt.serviceTitle}
                </span>
                <span className="text-muted-foreground">
                  Attending Doctor: <strong className="text-foreground">{apt.specialistName}</strong> · {apt.dateFormatted}
                </span>
                <span className="text-[11px] text-muted-foreground/80 block">
                  Ref: {apt.referenceNumber} · {apt.consultationType === "video" ? "Telehealth Call" : "In-Clinic Visit"}
                </span>
              </div>

              <div className="flex items-center gap-4 sm:self-center">
                <span
                  className={`px-2 py-0.5 text-[11px] font-semibold uppercase ${
                    apt.status === "completed"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {apt.status}
                </span>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-none text-xs h-8 px-3 border-border hover:border-primary text-foreground"
                >
                  <Link href={`/book?service=${apt.serviceId}&specialist=${apt.specialistId}`}>
                    Rebook Follow-up
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reschedule Dialog */}
      <RescheduleDialog
        appointment={activeRescheduleApt}
        open={!!activeRescheduleApt}
        onClose={() => setActiveRescheduleApt(null)}
        onRescheduled={handleRescheduled}
      />

      {/* Cancel Dialog */}
      <CancelDialog
        appointment={activeCancelApt}
        open={!!activeCancelApt}
        onClose={() => setActiveCancelApt(null)}
        onCancelled={handleCancelled}
      />

    </div>
  )
}
