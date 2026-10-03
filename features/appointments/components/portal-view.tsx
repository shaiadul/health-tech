"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RescheduleDialog } from "./reschedule-dialog"
import { CancelDialog } from "./cancel-dialog"
import { Appointment } from "@/types/appointment"
import {
  Calendar,
  Clock,
  Video,
  Phone,
  Building,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ExternalLink,
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
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, Alex
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage your fiduciary consultations, advisory materials, and financial milestones.
          </p>
        </div>

        <Button asChild size="sm" className="text-xs h-9 gap-1.5 shadow-xs font-semibold self-start sm:self-auto">
          <Link href="/book">
            <PlusCircle className="h-4 w-4" />
            <span>Book New Consultation</span>
          </Link>
        </Button>
      </div>

      {/* Top 3 KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Next Appointment Hero Card */}
        <Card className="border border-primary/30 bg-primary/5 shadow-xs sm:col-span-2 lg:col-span-1">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                Next Upcoming Session
              </span>
              <Badge variant="default" className="text-[10px]">
                Confirmed
              </Badge>
            </div>

            {nextAppointment ? (
              <div>
                <p className="text-lg font-bold text-foreground">
                  {nextAppointment.dateFormatted}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 font-mono">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>{nextAppointment.time} ({nextAppointment.durationMinutes} mins)</span>
                </div>
                <p className="text-xs text-foreground font-medium mt-2">
                  {nextAppointment.serviceTitle} with {nextAppointment.specialistName}
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No upcoming appointments scheduled.</p>
            )}

            {nextAppointment && (
              <Button
                asChild
                size="sm"
                className="w-full text-xs h-8 gap-1.5 font-medium bg-primary text-primary-foreground mt-2"
              >
                <a
                  href={nextAppointment.meetingLink || "#"}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Video className="h-3.5 w-3.5" />
                  <span>Join HD Video Room</span>
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Financial Health Diagnostic Score */}
        <Card className="border border-border/80 bg-card shadow-xs">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-medium">
              <span>Financial Health Score</span>
              <Activity className="h-4 w-4 text-success" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-foreground">94</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
              <Badge variant="success" className="text-[10px] ml-auto">
                Excellent
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              Top 5% for your peer cohort. Cashflow velocity and emergency reserve fully funded.
            </p>
          </CardContent>
        </Card>

        {/* Monthly Retained Savings */}
        <Card className="border border-border/80 bg-card shadow-xs">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-medium">
              <span>Monthly Capital Retention</span>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-foreground">৳42,500</span>
              <span className="text-xs text-success font-semibold font-mono">+12.4%</span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              Generated via automated sweep to Goldman Sachs Treasury Reserve (4.95% APY).
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Upcoming Consultations</h2>
          <span className="text-xs text-muted-foreground font-mono">{upcoming.length} scheduled</span>
        </div>

        {upcoming.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-border bg-card space-y-3">
            <p className="text-xs text-muted-foreground">You currently have no scheduled appointments.</p>
            <Button asChild size="sm" className="text-xs">
              <Link href="/book">Book a Consultation Now</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((apt) => (
              <Card key={apt.id} className="border border-border/80 bg-card shadow-2xs hover:border-border transition-all">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-14 w-14 border border-border">
                        <AvatarImage src={apt.specialistAvatar} alt={apt.specialistName} />
                        <AvatarFallback>{apt.specialistName.slice(0, 2)}</AvatarFallback>
                      </Avatar>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-foreground">{apt.serviceTitle}</h3>
                          <Badge
                            variant={apt.status === "rescheduled" ? "warning" : "default"}
                            className="text-[10px] capitalize"
                          >
                            {apt.status}
                          </Badge>
                        </div>

                        <p className="text-xs text-primary font-medium">
                          Specialist: {apt.specialistName} ({apt.specialistTitle})
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                          <span className="flex items-center gap-1 font-mono font-medium text-foreground">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            {apt.dateFormatted}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-mono font-medium text-foreground">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            {apt.time}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 capitalize">
                            <Video className="h-3.5 w-3.5 text-primary" />
                            {apt.consultationType} Call
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/60">
                      {apt.meetingLink && (
                        <Button asChild size="sm" className="text-xs h-8 gap-1.5 bg-primary text-primary-foreground">
                          <a href={apt.meetingLink} target="_blank" rel="noreferrer">
                            <Video className="h-3.5 w-3.5" />
                            <span>Join Meeting</span>
                          </a>
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveRescheduleApt(apt)}
                        className="text-xs h-8 border-border"
                      >
                        Reschedule
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveCancelApt(apt)}
                        className="text-xs h-8 text-destructive hover:bg-destructive/10"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Previous Consultations */}
      <div className="space-y-4 pt-4 border-t border-border/60">
        <h2 className="text-lg font-bold text-foreground">Previous Consultation History</h2>

        <div className="space-y-3">
          {past.map((apt) => (
            <div
              key={apt.id}
              className="p-4 rounded-xl border border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                    apt.status === "completed"
                      ? "bg-success/15 text-success"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {apt.status === "completed" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{apt.serviceTitle}</span>
                    <Badge
                      variant={apt.status === "completed" ? "success" : "destructive"}
                      className="text-[10px] capitalize"
                    >
                      {apt.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    with {apt.specialistName} • {apt.dateFormatted}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="xs" className="h-7 text-xs border-border">
                  <Link href={`/book?service=${apt.serviceId}`}>
                    Rebook Follow-up
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
