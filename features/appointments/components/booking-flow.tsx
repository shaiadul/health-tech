"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
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
import { DayAvailability, TimeSlot, Appointment } from "@/types/appointment"
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
  ShieldCheck,
  Loader2,
  Download,
  CalendarPlus,
  ChevronRight,
  Sparkles,
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
      lastName: "Mercer",
      email: "alex.mercer@gmail.com",
      phone: "+1 (555) 389-9921",
      contactMethod: "video",
      reason: "Comprehensive portfolio review and tax-efficient wealth growth",
      additionalNotes: "",
    },
  })

  // Synchronize consultation type with contactMethod
  React.useEffect(() => {
    form.setValue("contactMethod", consultationType)
  }, [consultationType, form])

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0]
  const selectedSpecialist = specialists.find((sp) => sp.id === selectedSpecialistId) || specialists[0]
  const currentDayAvailability = initialDates.find((d) => d.date === selectedDate)

  // Stepper definition
  const STEPS: { id: Step; label: string }[] = [
    { id: "service", label: "Service" },
    { id: "specialist", label: "Specialist" },
    { id: "schedule", label: "Date & Time" },
    { id: "details", label: "Details" },
    { id: "review", label: "Review" },
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

  // Download .ics calendar file simulation
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/20">
          Fiduciary Scheduler
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Schedule Your Consultation
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Book private 1-on-1 advisory time with a credentialed fiduciary expert. Zero sales incentives, 100% focused on your goals.
        </p>
      </div>

      {/* Stepper (Hidden on Confirmed screen) */}
      {currentStep !== "confirmed" && (
        <div className="bg-card border border-border/80 rounded-xl p-3 sm:p-4 shadow-2xs">
          <div className="flex items-center justify-between overflow-x-auto text-xs font-medium pb-1">
            {STEPS.map((s, idx) => {
              const activeIdx = getStepIndex(currentStep)
              const isPassed = activeIdx > idx
              const isCurrent = activeIdx === idx

              return (
                <React.Fragment key={s.id}>
                  <div className="flex items-center gap-1.5 shrink-0 px-2">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                        isPassed
                          ? "bg-success text-success-foreground"
                          : isCurrent
                          ? "bg-primary text-primary-foreground ring-2 ring-primary/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isPassed ? <Check className="h-3 w-3" /> : idx + 1}
                    </div>
                    <span
                      className={`${
                        isCurrent
                          ? "font-bold text-foreground"
                          : isPassed
                          ? "text-foreground/80 font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 min-w-[20px] max-w-[60px] mx-1 ${
                        isPassed ? "bg-success" : "bg-border"
                      }`}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      )}

      {/* STEP 1: Select Service */}
      {currentStep === "service" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Select Advisory Service</h2>
              <p className="text-xs text-muted-foreground">Choose the primary area of guidance you are looking to address</p>
            </div>
            <span className="text-xs font-mono text-muted-foreground">{services.length} services</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((srv) => {
              const isSelected = selectedServiceId === srv.id
              return (
                <div
                  key={srv.id}
                  onClick={() => setSelectedServiceId(srv.id)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary shadow-sm"
                      : "border-border/80 bg-card hover:border-border hover:bg-muted/20"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-foreground">{srv.title}</h3>
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/40"
                        }`}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5" />}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {srv.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/50 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3 text-primary" />
                      {srv.durationMinutes} min consultation
                    </span>
                    <span className="font-semibold text-foreground">{srv.feeDisplay}</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={() => setCurrentStep("specialist")}
              className="gap-1.5 px-6 font-semibold"
            >
              <span>Continue to Specialist</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Choose Specialist */}
      {currentStep === "specialist" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Select Financial Specialist</h2>
              <p className="text-xs text-muted-foreground">
                Matched for: <strong className="text-foreground">{selectedService.title}</strong>
              </p>
            </div>
            <Badge variant="outline" className="text-[10px]">
              Fiduciary Bound
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specialists.map((sp) => {
              const isSelected = selectedSpecialistId === sp.id
              return (
                <div
                  key={sp.id}
                  onClick={() => setSelectedSpecialistId(sp.id)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary shadow-sm"
                      : "border-border/80 bg-card hover:border-border hover:bg-muted/20"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border border-border">
                          <AvatarImage src={sp.avatar} alt={sp.name} />
                          <AvatarFallback>{sp.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-sm font-bold text-foreground">{sp.name}</h3>
                          <p className="text-[11px] text-primary font-medium">{sp.title}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {sp.experienceYears} Years • {sp.role}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/40"
                        }`}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5" />}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {sp.bio}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {sp.credentials.map((cred, i) => (
                        <Badge key={i} variant="secondary" className="text-[9px] py-0 px-1 font-normal">
                          {cred}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/50 text-[11px]">
                    <div className="flex items-center gap-1 text-amber-500 font-mono">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="font-bold text-foreground">{sp.rating}</span>
                      <span className="text-muted-foreground">({sp.reviewCount})</span>
                    </div>
                    <span className="text-muted-foreground font-mono">
                      Next: <strong className="text-foreground">{sp.nextAvailableSlot}</strong>
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep("service")}
              className="gap-1.5 text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
            <Button
              onClick={() => setCurrentStep("schedule")}
              className="gap-1.5 px-6 font-semibold"
            >
              <span>Continue to Schedule</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Date & Time Scheduler */}
      {currentStep === "schedule" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">Select Date & Time</h2>
            <p className="text-xs text-muted-foreground">
              Advisor: <strong className="text-foreground">{selectedSpecialist.name}</strong> • Timezone: Eastern Time (US & Canada)
            </p>
          </div>

          {/* Consultation Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Appointment Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setConsultationType("video")}
                className={`p-3.5 rounded-xl border cursor-pointer text-xs transition-all ${
                  consultationType === "video"
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                    : "border-border bg-card hover:bg-muted/20"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-foreground mb-1">
                  <Video className="h-4 w-4 text-primary" />
                  <span>Video Conference</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Join via HD video from phone or computer. Screen sharing enabled.
                </p>
              </div>

              <div
                onClick={() => setConsultationType("phone")}
                className={`p-3.5 rounded-xl border cursor-pointer text-xs transition-all ${
                  consultationType === "phone"
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                    : "border-border bg-card hover:bg-muted/20"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-foreground mb-1">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>Telephone Call</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Advisor dials your direct line at the appointed time.
                </p>
              </div>

              <div
                onClick={() => setConsultationType("in_person")}
                className={`p-3.5 rounded-xl border cursor-pointer text-xs transition-all ${
                  consultationType === "in_person"
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                    : "border-border bg-card hover:bg-muted/20"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-foreground mb-1">
                  <Building className="h-4 w-4 text-primary" />
                  <span>In-Person Office</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Private suite at Finora Financial District headquarters.
                </p>
              </div>
            </div>
          </div>

          {/* Calendar Day Pills Row */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Available Dates</span>
              <span className="text-[11px] text-muted-foreground font-mono">Next 14 Days</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {initialDates.map((day) => {
                const isSelected = selectedDate === day.date
                return (
                  <button
                    key={day.date}
                    type="button"
                    disabled={!day.isAvailable}
                    onClick={() => setSelectedDate(day.date)}
                    className={`flex flex-col items-center justify-center min-w-[64px] h-[72px] rounded-xl border text-center transition-all ${
                      !day.isAvailable
                        ? "opacity-35 cursor-not-allowed border-border/40 bg-muted/20"
                        : isSelected
                        ? "border-primary bg-primary text-primary-foreground shadow-sm scale-102"
                        : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
                    }`}
                  >
                    <span className="text-[11px] font-medium uppercase">{day.dayName}</span>
                    <span className="text-lg font-bold font-mono mt-0.5">{day.dayNumber}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Available Slots Grid */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-semibold text-foreground block">
              Available Times on {selectedDate}
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {currentDayAvailability?.slots.map((slot) => {
                const isSelected = selectedTime === slot.time
                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`p-3 rounded-xl border text-xs font-mono font-medium transition-all ${
                      !slot.available
                        ? "opacity-30 cursor-not-allowed border-border/40 bg-muted/10 line-through"
                        : isSelected
                        ? "border-primary bg-primary text-primary-foreground shadow-xs font-bold ring-2 ring-primary/20"
                        : "border-border bg-card hover:border-primary hover:bg-muted/20 text-foreground"
                    }`}
                  >
                    {slot.time}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep("specialist")}
              className="gap-1.5 text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
            <Button
              onClick={() => setCurrentStep("details")}
              className="gap-1.5 px-6 font-semibold"
            >
              <span>Continue to Information</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Customer Information Form */}
      {currentStep === "details" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">Your Contact Information</h2>
            <p className="text-xs text-muted-foreground">
              We send your secure calendar invitation and preparation materials here.
            </p>
          </div>

          <Form {...form}>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Alex" className="h-9 text-xs" {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Mercer" className="h-9 text-xs" {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Email Address (for calendar invite)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="alex.mercer@gmail.com" className="h-9 text-xs" {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Direct Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 389-9921" className="h-9 text-xs" {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Primary Consultation Objective</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Evaluating tech stock concentration and retirement target timeline"
                        className="h-9 text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Additional Notes or Questions (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Any specific topics, assets, or accounts you want covered"
                        className="h-9 text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep("schedule")}
              className="gap-1.5 text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
            <Button
              onClick={async () => {
                const isValid = await form.trigger()
                if (isValid) setCurrentStep("review")
              }}
              className="gap-1.5 px-6 font-semibold"
            >
              <span>Review Consultation</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5: Review Summary */}
      {currentStep === "review" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">Review Appointment Summary</h2>
            <p className="text-xs text-muted-foreground">
              Verify your advisory session details before confirming.
            </p>
          </div>

          <Card className="border border-border/80 bg-card p-6 space-y-4 shadow-sm">
            <div className="divide-y divide-border/60 text-xs">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Selected Service:</span>
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  {selectedService.title}
                  <button
                    type="button"
                    onClick={() => setCurrentStep("service")}
                    className="text-primary hover:underline text-[11px] font-normal"
                  >
                    (Edit)
                  </button>
                </span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Assigned Specialist:</span>
                <span className="font-medium text-foreground flex items-center gap-1.5">
                  {selectedSpecialist.name} ({selectedSpecialist.title})
                  <button
                    type="button"
                    onClick={() => setCurrentStep("specialist")}
                    className="text-primary hover:underline text-[11px] font-normal"
                  >
                    (Edit)
                  </button>
                </span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Scheduled Date:</span>
                <span className="font-mono font-medium text-foreground flex items-center gap-1.5">
                  {selectedDate}
                  <button
                    type="button"
                    onClick={() => setCurrentStep("schedule")}
                    className="text-primary hover:underline text-[11px] font-normal"
                  >
                    (Edit)
                  </button>
                </span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Scheduled Time:</span>
                <span className="font-mono font-medium text-foreground">{selectedTime}</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Format & Duration:</span>
                <span className="font-medium text-foreground capitalize">
                  {consultationType.replace("_", " ")} ({selectedService.durationMinutes} Minutes)
                </span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Client Name:</span>
                <span className="font-medium text-foreground">
                  {form.getValues("firstName")} {form.getValues("lastName")}
                </span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Confirmation Email:</span>
                <span className="font-mono text-foreground">{form.getValues("email")}</span>
              </div>

              <div className="flex justify-between py-2 font-bold text-sm">
                <span className="text-foreground">Consultation Fee:</span>
                <span className="font-mono text-success font-bold">100% Free Fiduciary Audit</span>
              </div>
            </div>

            <div className="p-3 bg-muted/30 rounded-lg border border-border/60 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-success shrink-0" />
              <span>
                Zero sales pressure guarantee: Your advisor is compensated exclusively on advice quality, never product commissions.
              </span>
            </div>
          </Card>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep("details")}
              disabled={isSubmitting}
              className="gap-1.5 text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>

            <Button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="gap-2 px-8 font-semibold shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Confirming Slot...</span>
                </>
              ) : (
                <>
                  <span>Confirm & Schedule</span>
                  <Check className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 6: Confirmation Screen */}
      {currentStep === "confirmed" && confirmedAppointment && (
        <Card className="border border-border shadow-xl bg-card p-8 sm:p-10 text-center space-y-6">
          <div className="mx-auto h-14 w-14 rounded-full bg-success/15 text-success flex items-center justify-center animate-in zoom-in-95">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <Badge variant="outline" className="text-xs font-mono">
              Ref: {confirmedAppointment.referenceNumber}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Appointment Confirmed!
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Your consultation has been booked on {confirmedAppointment.specialistName}&apos;s verified calendar.
            </p>
          </div>

          {/* Details Pill Box */}
          <div className="p-5 rounded-2xl bg-muted/30 border border-border/80 max-w-lg mx-auto text-left text-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-border/50">
              <span className="text-muted-foreground">Service:</span>
              <span className="font-bold text-foreground">{confirmedAppointment.serviceTitle}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border/50">
              <span className="text-muted-foreground">Specialist:</span>
              <span className="font-medium text-foreground">{confirmedAppointment.specialistName}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border/50">
              <span className="text-muted-foreground">Date & Time:</span>
              <span className="font-mono font-bold text-foreground">
                {confirmedAppointment.dateFormatted} at {confirmedAppointment.time}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border/50">
              <span className="text-muted-foreground">Meeting Format:</span>
              <span className="font-medium text-primary capitalize flex items-center gap-1">
                <Video className="h-3.5 w-3.5" />
                {confirmedAppointment.consultationType} Call (Link Sent)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Attendee:</span>
              <span className="font-medium text-foreground">
                {confirmedAppointment.customer.firstName} {confirmedAppointment.customer.lastName} ({confirmedAppointment.customer.email})
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleDownloadCalendar}
              className="w-full sm:w-auto text-xs h-10 gap-1.5 border-border font-medium"
            >
              <CalendarPlus className="h-4 w-4 text-primary" />
              <span>Add to Calendar (.ics)</span>
            </Button>

            <Button asChild className="w-full sm:w-auto text-xs h-10 font-semibold shadow-xs">
              <Link href="/portal">
                <span>View in Customer Portal</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t border-border/60 text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-success" />
            <span>A calendar invite with preparation links has been simulated to your inbox.</span>
          </div>
        </Card>
      )}
    </div>
  )
}
