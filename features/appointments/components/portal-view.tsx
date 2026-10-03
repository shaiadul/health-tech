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

  // Timeline events representing appointment lifecycle
  const timelineEvents = [
    {
      title: "Investment Planning Scheduled",
      subtitle: "With Sarah Ahmed, CFA · Video Consultation",
      date: "Oct 12, 2026",
      status: "active",
      type: "booked",
    },
    {
      title: "Preliminary Risk Profile Audited",
      subtitle: "Benchmark model calibrated to 72% portfolio progress",
      date: "Oct 03, 2026",
      status: "completed",
      type: "audit",
    },
    {
      title: "Tax Drag Consultation Completed",
      subtitle: "With Elena Rostova, CPA · Action items executed",
      date: "Sep 28, 2026",
      status: "completed",
      type: "completed",
    },
    {
      title: "Retirement Cashflow Strategy Session",
      subtitle: "Priya Patel, RICP® · Roth conversion timeline delivered",
      date: "Aug 14, 2026",
      status: "completed",
      type: "completed",
    },
  ]

  return (
    <div className="space-y-16">
      
      {/* Editorial Header & Large Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            Client Portal · Fiduciary Overview
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Good morning, Alex.
          </h1>
          <p className="text-sm text-muted-foreground">
            Account ID: <span className="font-mono text-foreground font-semibold">FN-89241</span> · Fiduciary Officer: Sarah Ahmed, CFA
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            asChild
            className="h-10 px-6 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold gap-2"
          >
            <Link href="/book">
              <PlusCircle className="h-4 w-4" />
              <span>Book consultation</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Large Balance & Metric Typography Strip (No Boxed Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 border-b border-border pb-12">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Monitored Portfolio
          </span>
          <p className="text-4xl sm:text-5xl font-bold font-mono tracking-tight text-foreground">
            $482,500
          </p>
          <span className="text-xs font-mono text-primary font-semibold block pt-1">
            +12.8% YTD Alpha
          </span>
        </div>

        <div className="space-y-1 sm:border-l sm:border-border sm:pl-10">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Monthly Savings Yield
          </span>
          <p className="text-4xl sm:text-5xl font-bold font-mono tracking-tight text-foreground">
            ৳42,500
          </p>
          <span className="text-xs font-mono text-muted-foreground block pt-1">
            4.95% annualized automated sweep
          </span>
        </div>

        <div className="space-y-1 sm:border-l sm:border-border sm:pl-10">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Financial Health
          </span>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl sm:text-5xl font-bold font-mono tracking-tight text-primary">
              94
            </p>
            <span className="text-xs font-mono text-muted-foreground">/ 100</span>
          </div>
          <span className="text-xs font-mono text-foreground font-medium block pt-1">
            Excellent Tier (Top 5% Cohort)
          </span>
        </div>
      </div>

      {/* Your Next Consultation (Editorial Layout, No Shadow Cards) */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-border pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Your next consultation
          </h2>
          <span className="text-xs font-mono text-primary font-semibold">
            Confirmed Slot
          </span>
        </div>

        {nextAppointment ? (
          <div className="py-8 border-b border-border space-y-6">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-foreground">
                  {nextAppointment.serviceTitle}
                </h3>
                <p className="text-sm text-muted-foreground">
                  with <strong className="text-foreground">{nextAppointment.specialistName}</strong> · {nextAppointment.specialistTitle}
                </p>
              </div>

              <div className="text-left md:text-right font-mono text-xs space-y-1">
                <p className="text-xl font-bold text-foreground">
                  {nextAppointment.dateFormatted} · {nextAppointment.time}
                </p>
                <p className="text-muted-foreground capitalize flex items-center md:justify-end gap-1.5">
                  <Video className="h-3.5 w-3.5 text-primary" />
                  <span>{nextAppointment.consultationType} Consultation ({nextAppointment.durationMinutes} min)</span>
                </p>
              </div>
            </div>

            {/* Quick Actions for Next Consultation */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border/60">
              {nextAppointment.meetingLink && (
                <Button
                  asChild
                  className="h-10 px-6 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold gap-2"
                >
                  <a href={nextAppointment.meetingLink} target="_blank" rel="noreferrer">
                    <Video className="h-3.5 w-3.5" />
                    <span>Join video consultation</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => setActiveRescheduleApt(nextAppointment)}
                className="h-10 px-6 rounded-none border-border hover:border-primary text-xs font-semibold gap-1.5"
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
          <div className="py-10 border-b border-border text-center space-y-3">
            <p className="text-sm text-muted-foreground">No upcoming consultations scheduled.</p>
            <Button asChild size="sm" className="rounded-none text-xs">
              <Link href="/book">Schedule a Consultation</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Two Column Layout: Upcoming List & Appointment Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Upcoming Consultations List */}
        <section className="lg:col-span-7 space-y-6">
          <div className="border-b border-border pb-4 flex items-baseline justify-between">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              All upcoming sessions
            </h2>
            <span className="text-xs font-mono text-muted-foreground">
              {upcoming.length} active
            </span>
          </div>

          <div className="divide-y divide-border">
            {upcoming.map((apt) => (
              <div key={apt.id} className="py-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {apt.serviceTitle}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Advisor: {apt.specialistName}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-primary font-semibold">
                    {apt.dateFormatted} · {apt.time}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setActiveRescheduleApt(apt)}
                    className="text-primary hover:underline"
                  >
                    Reschedule →
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCancelApt(apt)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Appointment Timeline (Section 18) */}
        <section className="lg:col-span-5 space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Advisory timeline
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Complete history of your consultations and milestones.
            </p>
          </div>

          <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {timelineEvents.map((event, idx) => {
              const isTeal = event.status === "active" || event.status === "completed"

              return (
                <div key={idx} className="relative">
                  {/* Timeline Node (Teal for active / completed) */}
                  <span
                    className={`absolute -left-6 top-1 h-4 w-4 rounded-full border-2 bg-background flex items-center justify-center ${
                      isTeal
                        ? "border-primary text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isTeal ? "bg-primary" : "bg-muted-foreground"
                      }`}
                    />
                  </span>

                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-sm font-bold text-foreground">
                        {event.title}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {event.subtitle}
                    </p>
                    <span className="text-[11px] font-mono text-muted-foreground/80 block pt-0.5">
                      {event.date}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

      </div>

      {/* Previous Consultations History Table */}
      <section className="space-y-6 pt-6 border-t border-border">
        <div className="border-b border-border pb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Previous consultations
          </h2>
          <span className="text-xs font-mono text-muted-foreground">
            {past.length} archived
          </span>
        </div>

        <div className="divide-y divide-border">
          {past.map((apt) => (
            <div
              key={apt.id}
              className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono"
            >
              <div className="space-y-1">
                <span className="font-bold text-foreground text-sm block">
                  {apt.serviceTitle}
                </span>
                <span className="text-muted-foreground">
                  Specialist: {apt.specialistName} · {apt.dateFormatted}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <span
                  className={`capitalize font-semibold ${
                    apt.status === "completed"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  ● {apt.status}
                </span>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-none text-xs h-8 px-4 border-border hover:border-primary text-foreground"
                >
                  <Link href={`/book?service=${apt.serviceId}`}>
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
