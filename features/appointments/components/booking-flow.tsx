"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  customerInfoSchema,
  CustomerInfoFormValues,
} from "../schemas/appointment.schema"
import { AppointmentService } from "../services/appointment.service"
import { FinancialService } from "@/types/service"
import { Specialist, ConsultationType } from "@/types/specialist"
import { DayAvailability, Appointment } from "@/types/appointment"
import {
  Check,
  CheckCircle2,
  Clock,
  Star,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Video,
  Phone,
  Building,
  Loader2,
  CalendarPlus,
  Home,
  ShieldCheck,
  Briefcase,
  UserCheck,
} from "lucide-react"

interface BookingFlowProps {
  services: FinancialService[]
  specialists: Specialist[]
  initialDates: DayAvailability[]
}

type Stage = "schedule" | "details" | "confirmed"

export function BookingFlow({
  services,
  specialists,
  initialDates,
}: BookingFlowProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const preselectedServiceId = searchParams.get("service")
  const preselectedSpecialistId = searchParams.get("specialist")

  const [currentStage, setCurrentStage] = React.useState<Stage>("schedule")
  const [selectedServiceId, setSelectedServiceId] = React.useState<string>(
    preselectedServiceId || services[0]?.id || ""
  )
  const [selectedSpecialistId, setSelectedSpecialistId] = React.useState<string>(
    preselectedSpecialistId || specialists[0]?.id || ""
  )
  const [consultationType, setConsultationType] = React.useState<ConsultationType>("video")
  const [selectedDate, setSelectedDate] = React.useState<string>(
    initialDates.find((d) => d.isAvailable)?.date || ""
  )
  const [selectedTime, setSelectedTime] = React.useState<string>("10:00 AM")
  const [confirmedAppointment, setConfirmedAppointment] = React.useState<Appointment | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Customer form with Zod validation
  const form = useForm<CustomerInfoFormValues>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      firstName: "Alex",
      lastName: "Rahman",
      email: "alex@example.com",
      phone: "+1 (555) 389-9921",
      contactMethod: "video",
      reason: "Portfolio audit & capital allocation strategy",
      additionalNotes: "",
    },
  })

  React.useEffect(() => {
    form.setValue("contactMethod", consultationType)
  }, [consultationType, form])

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0]
  const selectedSpecialist = specialists.find((sp) => sp.id === selectedSpecialistId) || specialists[0]
  const currentDayAvailability = initialDates.find((d) => d.date === selectedDate)

  // Handle final submission
  const handleFinalSubmit = async (values: CustomerInfoFormValues) => {
    setIsSubmitting(true)

    try {
      const newApt = await AppointmentService.createAppointment({
        serviceId: selectedServiceId,
        specialistId: selectedSpecialistId,
        consultationType,
        date: selectedDate,
        time: selectedTime,
        customer: values,
      })

      setConfirmedAppointment(newApt)
      setCurrentStage("confirmed")
    } catch (err) {
      console.error("Booking failed", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calendar download (.ics)
  const handleDownloadCalendar = () => {
    if (!confirmedAppointment) return

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Finora Technologies//Consultation//EN
BEGIN:VEVENT
UID:${confirmedAppointment.referenceNumber}@finora.io
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
SUMMARY:Finora: ${confirmedAppointment.serviceTitle} with ${confirmedAppointment.specialistName}
DESCRIPTION:Video consultation link: ${confirmedAppointment.meetingLink}
LOCATION:${confirmedAppointment.consultationType === "video" ? "Secure Video Link" : "Phone Call"}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Finora-${confirmedAppointment.referenceNumber}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 sm:px-8 space-y-12">
      
      {/* Header with Business Focus */}
      {currentStage !== "confirmed" && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>Institutional Fiduciary Consultation</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Schedule Your Strategy Session
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Connect directly with a verified fiduciary advisor. Free initial diagnostic, zero sales pitches, and a written executive briefing within 24 hours.
            </p>
          </div>

          {/* Simple 2-Step Business Stepper */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span
                className={`h-6 w-6 rounded-full flex items-center justify-center font-bold ${
                  currentStage === "schedule"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                1
              </span>
              <span className={currentStage === "schedule" ? "font-bold text-foreground" : "text-muted-foreground"}>
                Schedule & Advisor
              </span>
            </div>

            <div className="h-0.5 w-8 bg-border" />

            <div className="flex items-center gap-2">
              <span
                className={`h-6 w-6 rounded-full flex items-center justify-center font-bold ${
                  currentStage === "details"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </span>
              <span className={currentStage === "details" ? "font-bold text-foreground" : "text-muted-foreground"}>
                Executive Details
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 1: Schedule & Advisor (Clear, 2-Column Business Scheduler) */}
      {currentStage === "schedule" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Service & Advisor Selection */}
          <div className="lg:col-span-5 space-y-8">
            {/* Service Selector */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                1. Select Advisory Vertical
              </label>

              <div className="space-y-2">
                {services.map((srv) => {
                  const isSelected = selectedServiceId === srv.id
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`w-full p-4 text-left border transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border hover:bg-muted/20 text-muted-foreground hover:text-foreground bg-background"
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="font-bold text-sm block text-foreground">
                          {srv.title}
                        </span>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {srv.shortDescription}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono shrink-0 text-muted-foreground">
                        {srv.durationMinutes}m
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Matched Fiduciary Advisor */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                  2. Assigned Fiduciary Specialist
                </label>
                <span className="text-[11px] font-mono text-primary font-semibold">
                  Matched for {selectedService.title}
                </span>
              </div>

              <div className="space-y-2">
                {specialists.map((sp) => {
                  const isSelected = selectedSpecialistId === sp.id
                  return (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => setSelectedSpecialistId(sp.id)}
                      className={`w-full p-3.5 text-left border transition-all flex items-center justify-between gap-4 ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/20 bg-background"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-sm font-bold text-foreground block">
                          {sp.name}
                        </span>
                        <span className="text-xs text-muted-foreground block">
                          {sp.title} · {sp.experienceYears} yrs exp
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-mono font-semibold text-foreground">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span>{sp.rating}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Format Selector */}
            <div className="space-y-3 pt-4 border-t border-border">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                3. Meeting Format
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "video", label: "Video Call", icon: Video },
                  { id: "phone", label: "Phone Call", icon: Phone },
                  { id: "in_person", label: "In-Person", icon: Building },
                ].map((fmt) => {
                  const isSelected = consultationType === fmt.id
                  const Icon = fmt.icon
                  return (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setConsultationType(fmt.id as ConsultationType)}
                      className={`p-3 text-center border font-mono text-xs transition-all ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground font-bold"
                          : "border-border hover:border-primary text-foreground bg-background"
                      }`}
                    >
                      <Icon className="h-4 w-4 mx-auto mb-1 opacity-90" />
                      <span>{fmt.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Date & Available Times Calendar Strip */}
          <div className="lg:col-span-7 space-y-8 lg:border-l lg:border-border lg:pl-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                  4. Select Consultation Date
                </span>
                <span className="text-xs font-mono text-primary font-semibold">
                  14-Day Calendar
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {initialDates.slice(0, 14).map((day) => {
                  const isSelected = selectedDate === day.date
                  return (
                    <button
                      key={day.date}
                      type="button"
                      disabled={!day.isAvailable}
                      onClick={() => setSelectedDate(day.date)}
                      className={`py-3 px-2 border text-center transition-all ${
                        !day.isAvailable
                          ? "opacity-25 cursor-not-allowed border-border bg-muted/10 line-through text-muted-foreground"
                          : isSelected
                          ? "border-primary bg-primary text-primary-foreground font-bold shadow-xs"
                          : "border-border hover:border-primary text-foreground bg-background"
                      }`}
                    >
                      <span className="block text-[10px] uppercase font-mono">{day.dayName}</span>
                      <span className="block text-base font-mono font-bold mt-0.5">{day.dayNumber}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                  5. Available Openings on {selectedDate}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  Eastern Time (US)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {currentDayAvailability?.slots.map((slot) => {
                  const isSelected = selectedTime === slot.time
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`p-3 border font-mono text-xs transition-all flex items-center justify-between ${
                        !slot.available
                          ? "opacity-30 cursor-not-allowed border-border/60 bg-muted/10 line-through"
                          : isSelected
                          ? "border-primary bg-primary text-primary-foreground font-bold"
                          : "border-border hover:border-primary text-foreground bg-background"
                      }`}
                    >
                      <span>{slot.time}</span>
                      {isSelected ? (
                        <Check className="h-3.5 w-3.5 text-primary-foreground" />
                      ) : (
                        <span className="text-[10px] text-muted-foreground">Open</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Live Session Briefing Bar */}
            <div className="p-4 bg-muted/30 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
              <div className="space-y-0.5">
                <span className="text-foreground font-bold block">
                  {selectedService.title} with {selectedSpecialist.name}
                </span>
                <span className="text-muted-foreground">
                  {selectedDate} at {selectedTime} · {consultationType} format
                </span>
              </div>

              <div className="shrink-0">
                <span className="text-primary font-bold block sm:text-right">
                  100% Free Fiduciary Audit
                </span>
                <span className="text-[11px] text-muted-foreground block sm:text-right">
                  Written Strategy Deck Included
                </span>
              </div>
            </div>

            {/* Continue to Details Action */}
            <div className="flex justify-end pt-4">
              <Button
                type="button"
                onClick={() => setCurrentStage("details")}
                className="w-full sm:w-auto h-12 px-10 text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-2"
              >
                <span>Continue to Executive Details</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </div>
      )}

      {/* STAGE 2: Executive Details & 1-Click Confirmation */}
      {currentStage === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Form Inputs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-2xl font-bold text-foreground">
                Executive Contact Information
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Your direct calendar invite, encrypted video room link, and advisory prep notes will be sent here.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-mono uppercase text-muted-foreground">
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Alex"
                            className="h-11 rounded-none border-border bg-background focus:border-primary text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-mono uppercase text-muted-foreground">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Rahman"
                            className="h-11 rounded-none border-border bg-background focus:border-primary text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-mono uppercase text-muted-foreground">
                          Work or Personal Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="alex@company.com"
                            className="h-11 rounded-none border-border bg-background focus:border-primary text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-mono uppercase text-muted-foreground">
                          Direct Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+1 (555) 389-9921"
                            className="h-11 rounded-none border-border bg-background focus:border-primary text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-mono uppercase text-muted-foreground">
                        Primary Strategic Objective
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Portfolio diversification, tax drag mitigation, liquidity planning"
                          className="h-11 rounded-none border-border bg-background focus:border-primary text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-mono uppercase text-muted-foreground">
                        Specific Questions or Financial Goals (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us any specific assets, questions, or accounts to focus on during your session"
                          className="rounded-none border-border bg-background focus:border-primary text-sm resize-none min-h-[85px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStage("schedule")}
                    className="rounded-none text-xs h-11 px-6 gap-2"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Schedule</span>
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 px-10 text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Securing Slot...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm Consultation →</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Right Column: Live Executive Summary Card */}
          <div className="lg:col-span-5 lg:border-l lg:border-border lg:pl-10 space-y-6">
            <div className="border-b border-border pb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold block">
                Executive Summary
              </span>
              <h3 className="text-xl font-bold text-foreground mt-1">
                Your Consultation Overview
              </h3>
            </div>

            <div className="divide-y divide-border text-xs font-mono">
              <div className="py-3 flex justify-between">
                <span className="text-muted-foreground">Service Vertical</span>
                <span className="font-bold text-foreground">{selectedService.title}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-muted-foreground">Advisor</span>
                <span className="font-bold text-foreground">{selectedSpecialist.name}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-muted-foreground">Credentials</span>
                <span className="text-foreground">{selectedSpecialist.title}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-muted-foreground">Scheduled Date</span>
                <span className="font-bold text-foreground">{selectedDate}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-muted-foreground">Scheduled Time</span>
                <span className="font-bold text-foreground">{selectedTime} EST</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-muted-foreground">Meeting Format</span>
                <span className="text-foreground capitalize">{consultationType} Call</span>
              </div>
              <div className="py-3 flex justify-between font-bold">
                <span className="text-muted-foreground">Engagement Fee</span>
                <span className="text-primary">100% Free Fiduciary Audit</span>
              </div>
            </div>

            {/* Fiduciary Standard Assurance */}
            <div className="p-4 bg-muted/40 border border-border space-y-2 text-xs">
              <div className="flex items-center gap-2 text-foreground font-bold">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>The Finora Fiduciary Commitment</span>
              </div>
              <p className="text-muted-foreground leading-relaxed text-[11px]">
                Your advisor is legally bound to put your interests first. No product sales quotas, no hidden commissions, and total confidentiality guaranteed.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* STAGE 3: Executive Confirmation Screen */}
      {currentStage === "confirmed" && confirmedAppointment && (
        <div className="py-12 sm:py-16 text-left space-y-12 max-w-3xl mx-auto">
          
          <div className="space-y-4 border-b border-border pb-8">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Check className="h-6 w-6" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              You’re all set.
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Your consultation with <strong className="text-foreground">{confirmedAppointment.specialistName}</strong> has been secured for <strong className="text-foreground">{confirmedAppointment.dateFormatted}</strong> at <strong className="text-foreground">{confirmedAppointment.time}</strong>.
            </p>
          </div>

          {/* Minimal Editorial Summary */}
          <div className="divide-y divide-border border-b border-border text-xs font-mono">
            <div className="py-3.5 flex justify-between">
              <span className="text-muted-foreground">Consultation Ref</span>
              <span className="font-bold text-foreground">{confirmedAppointment.referenceNumber}</span>
            </div>
            <div className="py-3.5 flex justify-between">
              <span className="text-muted-foreground">Practice Vertical</span>
              <span className="text-foreground">{confirmedAppointment.serviceTitle}</span>
            </div>
            <div className="py-3.5 flex justify-between">
              <span className="text-muted-foreground">Advisor</span>
              <span className="text-foreground">{confirmedAppointment.specialistName}</span>
            </div>
            <div className="py-3.5 flex justify-between">
              <span className="text-muted-foreground">Meeting Format</span>
              <span className="text-foreground capitalize">{confirmedAppointment.consultationType} Consultation</span>
            </div>
            <div className="py-3.5 flex justify-between">
              <span className="text-muted-foreground">Client Attendee</span>
              <span className="text-foreground">{confirmedAppointment.customer.firstName} {confirmedAppointment.customer.lastName}</span>
            </div>
          </div>

          {/* Direct Action Strip */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Button
              variant="outline"
              onClick={handleDownloadCalendar}
              className="h-12 px-6 rounded-none border-border hover:border-primary text-xs font-semibold gap-2"
            >
              <CalendarPlus className="h-4 w-4 text-primary" />
              <span>Add to Calendar (.ics)</span>
            </Button>

            <Button
              asChild
              className="h-12 px-8 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold gap-2"
            >
              <Link href="/portal">
                <span>Go to Client Portal</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className="h-12 px-6 rounded-none text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <Link href="/" className="flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5" />
                <span>Return to Home</span>
              </Link>
            </Button>
          </div>

          <p className="text-xs font-mono text-muted-foreground pt-4">
            A confirmation email with preparatory questions has been simulated to {confirmedAppointment.customer.email}.
          </p>

        </div>
      )}

    </div>
  )
}
