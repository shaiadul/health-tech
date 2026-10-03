"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
  Activity,
  HeartPulse,
  User,
  Stethoscope,
  FileCheck2,
  Sparkles,
  MapPin,
  HelpCircle,
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
  const [consultationType, setConsultationType] = React.useState<ConsultationType>(
    searchParams.get("format") === "video" ? "video" : "in_person"
  )
  const [selectedDate, setSelectedDate] = React.useState<string>(
    initialDates.find((d) => d.isAvailable)?.date || ""
  )
  const [selectedTime, setSelectedTime] = React.useState<string>("10:30 AM")
  const [confirmedAppointment, setConfirmedAppointment] = React.useState<Appointment | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Patient form with Zod validation
  const form = useForm<CustomerInfoFormValues>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      firstName: "Alex",
      lastName: "Rahman",
      email: "alex@example.com",
      phone: "+1 (555) 389-9921",
      contactMethod: "in_person",
      reason: "Cardiology follow-up & resting ECG diagnostic review",
      additionalNotes: "Taking daily prescribed blood pressure medication.",
    },
  })

  React.useEffect(() => {
    form.setValue("contactMethod", consultationType)
  }, [consultationType, form])

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0]
  
  // Filter specialists matching selected department or show all if none match
  const filteredSpecialists = React.useMemo(() => {
    const matching = specialists.filter((sp) =>
      sp.specialties.some(
        (spec) =>
          spec.toLowerCase().includes(selectedService.title.toLowerCase().split(" ")[0]) ||
          selectedService.title.toLowerCase().includes(spec.toLowerCase().split(" ")[0])
      )
    )
    return matching.length > 0 ? matching : specialists
  }, [specialists, selectedService])

  const selectedSpecialist =
    specialists.find((sp) => sp.id === selectedSpecialistId) ||
    filteredSpecialists[0] ||
    specialists[0]

  const currentDayAvailability = initialDates.find((d) => d.date === selectedDate)

  // Morning vs afternoon slots
  const morningSlots = (currentDayAvailability?.slots || []).filter((s) => s.period === "morning")
  const afternoonSlots = (currentDayAvailability?.slots || []).filter((s) => s.period === "afternoon")

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
      window.scrollTo({ top: 0, behavior: "smooth" })
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
PRODID:-//MedPulse Health//Clinical Appointment//EN
BEGIN:VEVENT
UID:${confirmedAppointment.referenceNumber}@medpulse.health
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
SUMMARY:MedPulse: ${confirmedAppointment.serviceTitle} with ${confirmedAppointment.specialistName}
DESCRIPTION:Location: ${confirmedAppointment.consultationType === "video" ? confirmedAppointment.meetingLink : confirmedAppointment.locationAddress}
LOCATION:${confirmedAppointment.consultationType === "video" ? "Telehealth Video Link" : "MedPulse Hospital Main Clinic"}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `MedPulse-${confirmedAppointment.referenceNumber}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header with Business & Clinical Focus */}
      {currentStage !== "confirmed" && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              <Activity className="h-4 w-4" />
              <span>Outpatient Triage & Doctor Appointments</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Book a Medical Consultation
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Select department, attending physician, and preferred slot. Zero advance booking fee — consultation billed through insurance or at check-in.
            </p>
          </div>

          {/* Clean Stepper */}
          <div className="flex items-center gap-3 text-xs font-mono shrink-0">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 border transition-all ${
                currentStage === "schedule"
                  ? "border-primary bg-primary/10 text-primary font-bold"
                  : "border-border text-muted-foreground bg-muted/20"
              }`}
            >
              <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px]">
                1
              </span>
              <span>Doctor & Time</span>
            </div>

            <div className="h-px w-4 bg-border" />

            <div
              className={`flex items-center gap-2 px-3 py-1.5 border transition-all ${
                currentStage === "details"
                  ? "border-primary bg-primary/10 text-primary font-bold"
                  : "border-border text-muted-foreground bg-muted/20"
              }`}
            >
              <span className="h-5 w-5 rounded-full bg-muted text-foreground flex items-center justify-center text-[10px]">
                2
              </span>
              <span>Patient Intake</span>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 1: Department, Specialist, Format & Slot Picker */}
      {currentStage === "schedule" && (
        <div className="space-y-10">
          
          {/* 1. Department Filter Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px]">1</span>
                <span>Select Clinical Department</span>
              </label>
              <span className="text-[11px] font-mono text-primary font-semibold">
                {services.length} Specialized Faculties
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {services.map((srv) => {
                const isSelected = selectedServiceId === srv.id
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => {
                      setSelectedServiceId(srv.id)
                      // Auto-select first matching specialist
                      const matching = specialists.find((sp) =>
                        sp.specialties.some(
                          (spec) =>
                            spec.toLowerCase().includes(srv.title.toLowerCase().split(" ")[0]) ||
                            srv.title.toLowerCase().includes(spec.toLowerCase().split(" ")[0])
                        )
                      )
                      if (matching) setSelectedSpecialistId(matching.id)
                    }}
                    className={`p-3 text-left border transition-all flex flex-col justify-between gap-2 ${
                      isSelected
                        ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                        : "border-border hover:border-primary/50 bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs sm:text-sm block text-foreground leading-snug">
                        {srv.title}
                      </span>
                      <span className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {srv.shortDescription}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-border/50">
                      <span className="text-muted-foreground">{srv.durationMinutes} min consult</span>
                      <span className="text-primary font-bold">{srv.feeDisplay}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2. Choose Attending Physician */}
          <div className="space-y-3 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px]">2</span>
                <span>Select Attending Physician</span>
              </label>
              <span className="text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>All Board-Certified MDs</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredSpecialists.map((doc) => {
                const isSelected = selectedSpecialistId === doc.id
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedSpecialistId(doc.id)}
                    className={`p-4 text-left border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? "border-primary bg-primary/10 ring-1 ring-primary shadow-xs"
                        : "border-border hover:border-primary/50 bg-background"
                    }`}
                  >
                    <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0 border border-border bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs sm:text-sm text-foreground truncate">
                          {doc.name}
                        </span>
                        <div className="flex items-center gap-0.5 text-xs font-mono font-semibold text-foreground shrink-0">
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          <span>{doc.rating}</span>
                        </div>
                      </div>

                      <span className="text-[11px] text-primary block truncate">
                        {doc.title}
                      </span>

                      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1">
                        <span>{doc.experienceYears}y exp</span>
                        <span className="text-emerald-600 font-semibold">Available Today</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 3. Consultation Format */}
          <div className="space-y-3 pt-6 border-t border-border">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px]">3</span>
              <span>Choose Consultation Format</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConsultationType("in_person")}
                className={`p-4 border text-left transition-all flex items-start gap-3.5 ${
                  consultationType === "in_person"
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border hover:border-primary/50 bg-background"
                }`}
              >
                <div className="p-2 rounded bg-primary/10 text-primary shrink-0 mt-0.5">
                  <Building className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">In-Clinic Hospital Visit</span>
                    <Badge variant="secondary" className="text-[9px] py-0 px-1 font-mono">Exam Suite</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Face-to-face examination at MedPulse Hospital Main Center, Exam Room Suite 302.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setConsultationType("video")}
                className={`p-4 border text-left transition-all flex items-start gap-3.5 ${
                  consultationType === "video"
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border hover:border-primary/50 bg-background"
                }`}
              >
                <div className="p-2 rounded bg-primary/10 text-primary shrink-0 mt-0.5">
                  <Video className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">HD Telehealth Video</span>
                    <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono text-emerald-600 bg-emerald-500/10">Encrypted</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    HIPAA-compliant secure video room link delivered immediately to your email & SMS.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* 4. Interactive 14-Day Calendar & Slot Selector */}
          <div className="space-y-4 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px]">4</span>
                <span>Select Appointment Date & Time</span>
              </label>
              <span className="text-xs font-mono text-muted-foreground">
                Current Clinic Availability
              </span>
            </div>

            {/* Date Strip */}
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

            {/* Available Time Slots Categorized */}
            <div className="space-y-3 pt-3">
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
                  Morning Hours
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {morningSlots.map((slot) => {
                    const isSelected = selectedTime === slot.time
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`p-2.5 border font-mono text-xs transition-all flex items-center justify-between ${
                          !slot.available
                            ? "opacity-30 cursor-not-allowed border-border/60 bg-muted/10 line-through"
                            : isSelected
                            ? "border-primary bg-primary text-primary-foreground font-bold"
                            : "border-border hover:border-primary text-foreground bg-background"
                        }`}
                      >
                        <span>{slot.time}</span>
                        {isSelected ? (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        ) : (
                          <span className="text-[9px] text-muted-foreground">Open</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
                  Afternoon & Evening Hours
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {afternoonSlots.map((slot) => {
                    const isSelected = selectedTime === slot.time
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`p-2.5 border font-mono text-xs transition-all flex items-center justify-between ${
                          !slot.available
                            ? "opacity-30 cursor-not-allowed border-border/60 bg-muted/10 line-through"
                            : isSelected
                            ? "border-primary bg-primary text-primary-foreground font-bold"
                            : "border-border hover:border-primary text-foreground bg-background"
                        }`}
                      >
                        <span>{slot.time}</span>
                        {isSelected ? (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        ) : (
                          <span className="text-[9px] text-muted-foreground">Open</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Summary & Next Step Bar */}
          <div className="p-5 bg-muted/30 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-foreground">
                  {selectedSpecialist.name}
                </span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {selectedService.title}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {selectedDate} at {selectedTime} · {consultationType === "in_person" ? "In-Clinic Suite" : "Telehealth HD Video"}
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
              <div className="text-left sm:text-right">
                <span className="text-xs font-mono text-muted-foreground block">Consultation Fee</span>
                <span className="text-base font-bold font-mono text-primary block">
                  {selectedService.feeDisplay}
                </span>
                <span className="text-[10px] text-muted-foreground">Pay at clinic or via insurance</span>
              </div>

              <Button
                type="button"
                onClick={() => {
                  setCurrentStage("details")
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className="h-11 px-8 text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-2"
              >
                <span>Continue to Patient Details</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </div>
      )}

      {/* STAGE 2: Patient Details & Triage Intake Form */}
      {currentStage === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Form Inputs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-2xl font-bold text-foreground">
                Patient Intake & Contact Information
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Your confirmation reference, calendar invite, and attending physician notes will be sent here.
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
                          Patient First Name
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
                          Patient Last Name
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
                          Email (for confirmation & video room)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="alex@example.com"
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
                          Mobile Phone (for SMS updates)
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
                        Chief Medical Complaint / Primary Symptoms
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Chest tightness during exertion, routine diagnostic review"
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
                        Current Medications & Known Allergies (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List any daily prescribed medications, penicillin allergies, or previous surgeries"
                          className="rounded-none border-border bg-background focus:border-primary text-sm resize-none min-h-[85px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Patient Assurances */}
                <div className="p-4 bg-muted/20 border border-border space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>Hospital Guarantee & Zero Advance Fee</span>
                  </div>
                  <ul className="text-muted-foreground space-y-1 text-[11px] list-disc list-inside">
                    <li>Free rescheduling & cancellation up to 24 hours prior.</li>
                    <li>Health insurance claims pre-verified directly at check-in.</li>
                    <li>Encrypted under HIPAA & hospital electronic record standards.</li>
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setCurrentStage("schedule")
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
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
                        <span>Confirming Slot...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm Doctor Appointment</span>
                        <Check className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Right Column: Live Overview Card */}
          <div className="lg:col-span-5 lg:border-l lg:border-border lg:pl-10 space-y-6">
            <div className="border-b border-border pb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold block">
                Appointment Summary
              </span>
              <h3 className="text-xl font-bold text-foreground mt-1">
                Your Scheduled Visit
              </h3>
            </div>

            <div className="divide-y divide-border text-xs font-mono">
              <div className="py-3 flex justify-between">
                <span className="text-muted-foreground">Department</span>
                <span className="font-bold text-foreground">{selectedService.title}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-muted-foreground">Attending Physician</span>
                <span className="font-bold text-foreground">{selectedSpecialist.name}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-muted-foreground">Scheduled Date</span>
                <span className="font-bold text-foreground">{selectedDate}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-muted-foreground">Scheduled Time</span>
                <span className="font-bold text-foreground">{selectedTime}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-muted-foreground">Visit Format</span>
                <span className="text-foreground capitalize">{consultationType === "in_person" ? "In-Clinic Suite" : "Telehealth Video"}</span>
              </div>
              <div className="py-3 flex justify-between font-bold">
                <span className="text-muted-foreground">Deposit Due Now</span>
                <span className="text-emerald-600">$0.00 (Pay at Visit)</span>
              </div>
            </div>

            <div className="p-4 bg-muted/40 border border-border space-y-2 text-xs">
              <div className="flex items-center gap-2 text-foreground font-bold">
                <HeartPulse className="h-4 w-4 text-primary" />
                <span>Patient Preparation Tip</span>
              </div>
              <p className="text-muted-foreground leading-relaxed text-[11px]">
                Please bring a photo ID and your current insurance card or recent lab reports to expedite your check-in.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* STAGE 3: Clinical Confirmation Screen */}
      {currentStage === "confirmed" && confirmedAppointment && (
        <div className="py-8 sm:py-12 text-left space-y-8 max-w-3xl mx-auto">
          
          <div className="space-y-4 border-b border-border pb-8">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Check className="h-6 w-6" />
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Appointment Confirmed.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Your medical consultation with <strong className="text-foreground">{confirmedAppointment.specialistName}</strong> is confirmed for <strong className="text-foreground">{confirmedAppointment.dateFormatted}</strong> at <strong className="text-foreground">{confirmedAppointment.time}</strong>.
            </p>
          </div>

          {/* Minimal Clinical Summary */}
          <div className="divide-y divide-border border-b border-border text-xs font-mono">
            <div className="py-3.5 flex justify-between">
              <span className="text-muted-foreground">Appointment Reference</span>
              <span className="font-bold text-foreground">{confirmedAppointment.referenceNumber}</span>
            </div>
            <div className="py-3.5 flex justify-between">
              <span className="text-muted-foreground">Department</span>
              <span className="text-foreground">{confirmedAppointment.serviceTitle}</span>
            </div>
            <div className="py-3.5 flex justify-between">
              <span className="text-muted-foreground">Physician</span>
              <span className="text-foreground">{confirmedAppointment.specialistName}</span>
            </div>
            <div className="py-3.5 flex justify-between">
              <span className="text-muted-foreground">Visit Format</span>
              <span className="text-foreground capitalize">{confirmedAppointment.consultationType === "in_person" ? "In-Clinic Hospital Suite" : "Telehealth Video Consultation"}</span>
            </div>
            <div className="py-3.5 flex justify-between">
              <span className="text-muted-foreground">Patient Attendee</span>
              <span className="text-foreground">{confirmedAppointment.customer.firstName} {confirmedAppointment.customer.lastName}</span>
            </div>
          </div>

          {/* Direct Action Strip */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleDownloadCalendar}
              className="h-11 px-6 rounded-none border-border hover:border-primary text-xs font-semibold gap-2"
            >
              <CalendarPlus className="h-4 w-4 text-primary" />
              <span>Add to Calendar (.ics)</span>
            </Button>

            <Button
              asChild
              className="h-11 px-8 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold gap-2"
            >
              <Link href="/portal">
                <span>View in Patient Portal</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className="h-11 px-6 rounded-none text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <Link href="/" className="flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5" />
                <span>Return to Home</span>
              </Link>
            </Button>
          </div>

          <p className="text-xs font-mono text-muted-foreground pt-2">
            A confirmation email with clinic directions and intake instructions has been simulated to {confirmedAppointment.customer.email}.
          </p>

        </div>
      )}

    </div>
  )
}
