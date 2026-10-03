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
  Edit2,
} from "lucide-react"

interface BookingFlowProps {
  services: FinancialService[]
  specialists: Specialist[]
  initialDates: DayAvailability[]
}

type Step = "service" | "specialist" | "schedule" | "details" | "review" | "confirmed"

export function BookingFlow({
  services,
  specialists,
  initialDates,
}: BookingFlowProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const preselectedServiceId = searchParams.get("service")
  const preselectedSpecialistId = searchParams.get("specialist")

  const [currentStep, setCurrentStep] = React.useState<Step>("service")
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
      reason: "Comprehensive portfolio review and tax-efficient wealth growth",
      additionalNotes: "",
    },
  })

  React.useEffect(() => {
    form.setValue("contactMethod", consultationType)
  }, [consultationType, form])

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0]
  const selectedSpecialist = specialists.find((sp) => sp.id === selectedSpecialistId) || specialists[0]
  const currentDayAvailability = initialDates.find((d) => d.date === selectedDate)

  const STEPS: { id: Step; label: string; number: string }[] = [
    { id: "service", label: "Service", number: "01" },
    { id: "specialist", label: "Specialist", number: "02" },
    { id: "schedule", label: "Date & time", number: "03" },
    { id: "details", label: "Your details", number: "04" },
    { id: "review", label: "Confirm", number: "05" },
  ]

  const getStepIndex = (step: Step) => {
    return STEPS.findIndex((s) => s.id === step)
  }

  // Handle final submission
  const handleFinalSubmit = async () => {
    setIsSubmitting(true)

    try {
      const customerData = form.getValues()
      const newApt = await AppointmentService.createAppointment({
        serviceId: selectedServiceId,
        specialistId: selectedSpecialistId,
        consultationType,
        date: selectedDate,
        time: selectedTime,
        customer: customerData,
      })

      setConfirmedAppointment(newApt)
      setCurrentStep("confirmed")
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
    <div className="max-w-4xl mx-auto py-12 px-6 sm:px-8 space-y-12">
      
      {/* Subtle Top Progress Header (Hidden on Confirmed) */}
      {currentStep !== "confirmed" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-border pb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold block">
                Book a Consultation
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-1">
                Schedule your session.
              </h1>
            </div>

            <div className="text-xs font-mono text-muted-foreground">
              Step {getStepIndex(currentStep) + 1} of {STEPS.length}
            </div>
          </div>

          {/* Minimal Editorial Stepper */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 text-xs font-mono">
            {STEPS.map((s, idx) => {
              const activeIdx = getStepIndex(currentStep)
              const isPassed = activeIdx > idx
              const isCurrent = activeIdx === idx

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    if (isPassed) setCurrentStep(s.id)
                  }}
                  disabled={!isPassed}
                  className={`text-left pt-2 border-t-2 transition-colors ${
                    isCurrent
                      ? "border-primary text-foreground font-semibold"
                      : isPassed
                      ? "border-primary/50 text-foreground cursor-pointer hover:border-primary"
                      : "border-border text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  <span className="block text-[11px] text-primary font-bold">
                    {s.number}
                  </span>
                  <span className="truncate block mt-0.5">{s.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* STEP 1: Service Selection (Large Selectable Rows, No Cards) */}
      {currentStep === "service" && (
        <div className="space-y-8">
          <div className="border-b border-border pb-4">
            <h2 className="text-xl font-bold text-foreground">
              01 · Select Advisory Service
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Choose the primary area of strategic guidance you want to discuss.
            </p>
          </div>

          <div className="divide-y divide-border">
            {services.map((srv, index) => {
              const isSelected = selectedServiceId === srv.id
              const indexFormatted = String(index + 1).padStart(2, "0")

              return (
                <div
                  key={srv.id}
                  onClick={() => setSelectedServiceId(srv.id)}
                  className={`py-6 px-4 sm:px-6 cursor-pointer transition-all border-l-4 ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-transparent hover:bg-muted/30"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                    <div className="flex items-start sm:items-baseline gap-4 sm:gap-6">
                      <span className="font-mono text-sm text-muted-foreground">
                        {indexFormatted}
                      </span>
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg sm:text-xl font-bold text-foreground">
                            {srv.title}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {srv.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pl-10 sm:pl-0 font-mono text-xs">
                      <span className="text-muted-foreground">
                        {srv.durationMinutes} min
                      </span>
                      <ArrowRight
                        className={`h-4 w-4 transition-transform ${
                          isSelected
                            ? "text-primary translate-x-1.5"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-end pt-6 border-t border-border">
            <Button
              onClick={() => setCurrentStep("specialist")}
              className="h-11 px-8 text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-2"
            >
              <span>Choose Specialist</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Specialist Selection (Clean Editorial List, No Cards) */}
      {currentStep === "specialist" && (
        <div className="space-y-8">
          <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                02 · Select Financial Specialist
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Fiduciary advisors available for: <strong className="text-foreground">{selectedService.title}</strong>
              </p>
            </div>
            <span className="text-xs font-mono text-primary font-semibold">
              Fiduciary Duty Bound
            </span>
          </div>

          <div className="divide-y divide-border">
            {specialists.map((sp) => {
              const isSelected = selectedSpecialistId === sp.id

              return (
                <div
                  key={sp.id}
                  onClick={() => setSelectedSpecialistId(sp.id)}
                  className={`py-6 px-4 sm:px-6 cursor-pointer transition-all border-l-4 ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-transparent hover:bg-muted/30"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1.5 max-w-lg">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg sm:text-xl font-bold text-foreground">
                          {sp.name}
                        </h3>
                        {isSelected && (
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-primary text-primary-foreground">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-foreground/80">
                        {sp.title}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground">
                        {sp.specialties.join(" • ")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-10 text-xs font-mono">
                      <div>
                        <span className="block text-foreground font-semibold">
                          {sp.experienceYears} yrs
                        </span>
                        <span className="text-muted-foreground text-[11px]">experience</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span className="font-semibold text-foreground">{sp.rating}</span>
                        <span className="text-muted-foreground text-[11px]">rating</span>
                      </div>

                      <div>
                        <Button
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className={`rounded-none text-xs h-8 px-4 ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "border-border hover:border-primary text-foreground"
                          }`}
                        >
                          {isSelected ? "Selected" : "Select →"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setCurrentStep("service")}
              className="rounded-none text-xs h-10 px-6 gap-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
            <Button
              onClick={() => setCurrentStep("schedule")}
              className="h-10 px-8 text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-2"
            >
              <span>Continue to Date & Time</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Date & Time (Calendar + Available Times, No Giant Cards) */}
      {currentStep === "schedule" && (
        <div className="space-y-8">
          <div className="border-b border-border pb-4">
            <h2 className="text-xl font-bold text-foreground">
              03 · Choose Date & Time
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Advisor: <strong className="text-foreground">{selectedSpecialist.name}</strong> · All slots displayed in Eastern Time (US & Canada).
            </p>
          </div>

          {/* Meeting Format Selector */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Consultation Format
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "video", label: "Video Call", desc: "Encrypted HD conference link", icon: Video },
                { id: "phone", label: "Phone Call", desc: "Advisor dials your direct line", icon: Phone },
                { id: "in_person", label: "In-Person", desc: "Finora Private Office Suite", icon: Building },
              ].map((fmt) => {
                const isSelected = consultationType === fmt.id
                const IconComponent = fmt.icon
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setConsultationType(fmt.id as ConsultationType)}
                    className={`p-4 text-left border transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border hover:bg-muted/20 text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm text-foreground mb-1">
                      <IconComponent className={`h-4 w-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      <span>{fmt.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{fmt.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Desktop & Mobile Responsive Scheduler */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-border">
            
            {/* Left: Date Selection Strip / Grid */}
            <div className="md:col-span-6 space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                Available Dates (Next 14 Days)
              </span>

              <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                {initialDates.map((day) => {
                  const isSelected = selectedDate === day.date
                  return (
                    <button
                      key={day.date}
                      type="button"
                      disabled={!day.isAvailable}
                      onClick={() => setSelectedDate(day.date)}
                      className={`py-3 px-2 border text-center transition-all ${
                        !day.isAvailable
                          ? "opacity-30 cursor-not-allowed border-border bg-muted/10 line-through"
                          : isSelected
                          ? "border-primary bg-primary text-primary-foreground font-bold"
                          : "border-border hover:border-primary hover:bg-muted/20 text-foreground"
                      }`}
                    >
                      <span className="block text-[10px] uppercase font-mono">{day.dayName}</span>
                      <span className="block text-base font-mono font-bold mt-0.5">{day.dayNumber}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right: Available Times List */}
            <div className="md:col-span-6 space-y-4 md:border-l md:border-border md:pl-8">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                Available Times on {selectedDate}
              </span>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {currentDayAvailability?.slots.map((slot) => {
                  const isSelected = selectedTime === slot.time
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`w-full py-2.5 px-4 border text-left font-mono text-xs transition-all flex items-center justify-between ${
                        !slot.available
                          ? "opacity-30 cursor-not-allowed border-border/60 bg-muted/10"
                          : isSelected
                          ? "border-primary bg-primary text-primary-foreground font-bold"
                          : "border-border hover:border-primary hover:bg-muted/20 text-foreground"
                      }`}
                    >
                      <span>{slot.time}</span>
                      {isSelected ? (
                        <Check className="h-3.5 w-3.5 text-primary-foreground" />
                      ) : (
                        <span className="text-[10px] text-muted-foreground">Available</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setCurrentStep("specialist")}
              className="rounded-none text-xs h-10 px-6 gap-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
            <Button
              onClick={() => setCurrentStep("details")}
              className="h-10 px-8 text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-2"
            >
              <span>Continue to Details</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Customer Details Form (React Hook Form + Zod, No Card Containers) */}
      {currentStep === "details" && (
        <div className="space-y-8">
          <div className="border-b border-border pb-4">
            <h2 className="text-xl font-bold text-foreground">
              04 · Your Contact Information
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Your calendar invitation and preparatory diagnostic notes will be sent here.
            </p>
          </div>

          <Form {...form}>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-mono uppercase text-muted-foreground">
                        Email Address (for calendar invite)
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
                        Phone Number
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
                      Primary Consultation Objective
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Evaluating investment diversification and tax strategies"
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
                      Additional Notes or Questions (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any specific topics, accounts, or liquidity events you want to focus on"
                        className="rounded-none border-border bg-background focus:border-primary text-sm resize-none min-h-[90px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setCurrentStep("schedule")}
              className="rounded-none text-xs h-10 px-6 gap-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
            <Button
              onClick={async () => {
                const isValid = await form.trigger()
                if (isValid) setCurrentStep("review")
              }}
              className="h-10 px-8 text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-2"
            >
              <span>Review Details</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5: Editorial Review Summary (Clean Editorial Table/List, No Shadow Card) */}
      {currentStep === "review" && (
        <div className="space-y-8">
          <div className="border-b border-border pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold block">
              Review Appointment
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mt-1">
              Verify your session.
            </h2>
          </div>

          <div className="divide-y divide-border border-y border-border">
            
            {/* Service & Specialist */}
            <div className="py-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-muted-foreground block">
                  Service
                </span>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {selectedService.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  with {selectedSpecialist.name} · {selectedSpecialist.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep("service")}
                className="text-xs font-mono text-primary hover:underline self-start sm:self-auto flex items-center gap-1"
              >
                <Edit2 className="h-3 w-3" />
                <span>Change service</span>
              </button>
            </div>

            {/* Date & Time */}
            <div className="py-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-muted-foreground block">
                  Date & Time
                </span>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {selectedDate} · {selectedTime}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                  {selectedService.durationMinutes} minutes · {consultationType.replace("_", " ")} consultation
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep("schedule")}
                className="text-xs font-mono text-primary hover:underline self-start sm:self-auto flex items-center gap-1"
              >
                <Edit2 className="h-3 w-3" />
                <span>Change time</span>
              </button>
            </div>

            {/* Client Info */}
            <div className="py-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-muted-foreground block">
                  Your Information
                </span>
                <p className="text-lg font-bold text-foreground mt-1">
                  {form.getValues("firstName")} {form.getValues("lastName")}
                </p>
                <p className="text-xs font-mono text-muted-foreground mt-0.5">
                  {form.getValues("email")} · {form.getValues("phone")}
                </p>
                {form.getValues("reason") && (
                  <p className="text-xs text-muted-foreground mt-2 max-w-lg">
                    <span className="font-medium text-foreground">Objective:</span> {form.getValues("reason")}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep("details")}
                className="text-xs font-mono text-primary hover:underline self-start sm:self-auto flex items-center gap-1"
              >
                <Edit2 className="h-3 w-3" />
                <span>Edit details</span>
              </button>
            </div>

            {/* Advisory Fee Disclosure */}
            <div className="py-6 flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-muted-foreground">
                Introductory Fee
              </span>
              <span className="font-mono text-sm font-bold text-primary">
                100% Complimentary · Fiduciary Audit
              </span>
            </div>

          </div>

          <div className="flex items-center justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep("details")}
              disabled={isSubmitting}
              className="rounded-none text-xs h-11 px-6 gap-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>

            <Button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="h-11 px-10 text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Confirming slot...</span>
                </>
              ) : (
                <>
                  <span>Confirm appointment →</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 6: Confirmation Screen (Full-Screen Minimal Success, No Card Wrapper) */}
      {currentStep === "confirmed" && confirmedAppointment && (
        <div className="py-12 sm:py-16 text-left space-y-12">
          
          <div className="space-y-4 border-b border-border pb-8">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Check className="h-6 w-6" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              You’re all set.
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Your consultation with <strong className="text-foreground">{confirmedAppointment.specialistName}</strong> has been scheduled for <strong className="text-foreground">{confirmedAppointment.dateFormatted}</strong> at <strong className="text-foreground">{confirmedAppointment.time}</strong>.
            </p>
          </div>

          {/* Minimal Editorial Summary */}
          <div className="divide-y divide-border border-b border-border text-xs font-mono">
            <div className="py-3 flex justify-between">
              <span className="text-muted-foreground">Reference ID</span>
              <span className="font-bold text-foreground">{confirmedAppointment.referenceNumber}</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-muted-foreground">Advisory Vertical</span>
              <span className="text-foreground">{confirmedAppointment.serviceTitle}</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-muted-foreground">Format</span>
              <span className="text-foreground capitalize">{confirmedAppointment.consultationType} Call</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-muted-foreground">Client</span>
              <span className="text-foreground">{confirmedAppointment.customer.firstName} {confirmedAppointment.customer.lastName}</span>
            </div>
          </div>

          {/* Clean Editorial Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Button
              variant="outline"
              onClick={handleDownloadCalendar}
              className="h-12 px-6 rounded-none border-border hover:border-primary text-xs font-semibold gap-2"
            >
              <CalendarPlus className="h-4 w-4 text-primary" />
              <span>Add to calendar</span>
            </Button>

            <Button
              asChild
              className="h-12 px-8 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold gap-2"
            >
              <Link href="/portal">
                <span>View appointment</span>
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
                <span>Back to home</span>
              </Link>
            </Button>
          </div>

        </div>
      )}

    </div>
  )
}
