"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
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
import { useAuth } from "@/lib/auth-context"
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  Bone,
  Brain,
  Building2,
  Calendar,
  CalendarPlus,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  ExternalLink,
  FileText,
  Heart,
  Home,
  Info,
  Loader2,
  Lock,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Sun,
  Sunset,
  User,
  Users,
  Video,
} from "lucide-react"

interface BookingFlowProps {
  services: FinancialService[]
  specialists: Specialist[]
  initialDates: DayAvailability[]
}

type Step = 1 | 2 | 3 | 4 | "confirmed"

const STEPS = [
  { n: 1, label: "Department", desc: "Select clinical care" },
  { n: 2, label: "Physician", desc: "Choose attending doctor" },
  { n: 3, label: "Schedule", desc: "Format, date & time" },
  { n: 4, label: "Patient Info", desc: "Intake & contact" },
] as const

const SERVICE_ICONS: Record<string, React.ElementType> = {
  srv_cardio_01: Heart,
  srv_neuro_02: Brain,
  srv_pediatrics_03: Baby,
  srv_ortho_04: Bone,
  srv_exec_07: Sparkles,
}

const PERIOD_META = {
  morning: { label: "Morning", icon: Sun, desc: "8:00 AM – 12:00 PM" },
  afternoon: { label: "Afternoon", icon: Sun, desc: "12:00 PM – 4:00 PM" },
  evening: { label: "Evening", icon: Sunset, desc: "4:00 PM – 8:00 PM" },
} as const

const QUICK_REASONS = [
  "Annual Wellness Checkup",
  "Chest Discomfort / Heart Health",
  "Persistent Headache / Migraine",
  "Joint & Back Pain Evaluation",
  "Skin Rash or Mole Check",
  "Prescription Refill / Follow-up",
  "Lab & Imaging Results Review",
]

function formatDay(dateStr: string) {
  if (!dateStr) return ""
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

function getGoogleCalendarUrl(apt: Appointment) {
  const title = encodeURIComponent(
    `MedPulse Consultation: ${apt.serviceTitle} with ${apt.specialistName}`
  )
  const details = encodeURIComponent(
    `Medical Appointment with ${apt.specialistName} (${apt.specialistTitle}).\nReference ID: ${apt.referenceNumber}\nConsultation Type: ${apt.consultationType}\n${
      apt.consultationType === "video"
        ? `Telehealth HD Room: ${apt.meetingLink}`
        : `Hospital Clinic Location: ${apt.locationAddress}`
    }`
  )
  const location = encodeURIComponent(
    apt.consultationType === "video"
      ? "Encrypted HD Telehealth Room (MedPulse Health)"
      : apt.locationAddress || "MedPulse Hospital Main Campus, Suite 400"
  )
  const dateClean = (apt.date || "").replace(/-/g, "")
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateClean}T140000Z/${dateClean}T150000Z`
}

export function BookingFlow({
  services,
  specialists,
  initialDates,
}: BookingFlowProps) {
  const searchParams = useSearchParams()
  const { isAuthenticated, user, loginAs } = useAuth()

  const specialistParam = searchParams.get("specialist")
  const serviceParam = searchParams.get("service")
  const formatParam = searchParams.get("format")

  const doctorsFor = React.useCallback(
    (service?: FinancialService) => {
      if (!service) return specialists
      const matches = specialists.filter((sp) =>
        sp.specialties.some(
          (s) =>
            s.toLowerCase().includes(service.title.toLowerCase()) ||
            service.title.toLowerCase().includes(s.toLowerCase())
        )
      )
      return matches.length > 0 ? matches : specialists
    },
    [specialists]
  )

  // Resolve initial selections + starting step from deep links
  const initial = React.useMemo(() => {
    const doctor = specialists.find((s) => s.id === specialistParam)
    let service = services.find((s) => s.id === serviceParam)
    if (!service && doctor) {
      service = services.find((s) =>
        doctor.specialties.some(
          (spec) =>
            spec.toLowerCase().includes(s.title.toLowerCase()) ||
            s.title.toLowerCase().includes(spec.toLowerCase())
        )
      )
    }
    const startStep: Step = doctor ? 3 : service ? 2 : 1
    return { doctor, service, startStep }
  }, [specialists, services, specialistParam, serviceParam])

  const [step, setStep] = React.useState<Step>(initial.startStep)
  const [serviceId, setServiceId] = React.useState<string>(
    initial.service?.id ?? services[0]?.id ?? ""
  )
  const [specialistId, setSpecialistId] = React.useState<string>(
    initial.doctor?.id ?? doctorsFor(initial.service ?? services[0])[0]?.id ?? ""
  )
  const [consultationType, setConsultationType] = React.useState<ConsultationType>(
    formatParam === "video"
      ? "video"
      : formatParam === "phone"
      ? "phone"
      : "in_person"
  )
  const [selectedDate, setSelectedDate] = React.useState<string>(
    initialDates.find((d) => d.isAvailable)?.date ?? ""
  )
  const [selectedTime, setSelectedTime] = React.useState<string>("")
  const [confirmed, setConfirmed] = React.useState<Appointment | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [copiedRef, setCopiedRef] = React.useState(false)

  // Step 1 Category Filter & Search
  const [departmentCategory, setDepartmentCategory] = React.useState<string>("all")
  const [departmentSearch, setDepartmentSearch] = React.useState("")

  // Step 2 Doctor Filter & Search
  const [doctorSearch, setDoctorSearch] = React.useState("")
  const [doctorFilter, setDoctorFilter] = React.useState<"all" | "today" | "top_rated">("all")
  const [expandedDoctorBio, setExpandedDoctorBio] = React.useState<string | null>(null)

  // Step 4 Patient options
  const [bookingFor, setBookingFor] = React.useState<"self" | "dependent">("self")
  const [insurancePreference, setInsurancePreference] = React.useState<"commercial" | "medicare" | "self_pay">("commercial")

  const form = useForm<CustomerInfoFormValues>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      contactMethod: consultationType,
      reason: "",
      additionalNotes: "",
      bookingFor: "self",
      insuranceType: "commercial",
    },
  })

  React.useEffect(() => {
    form.setValue("contactMethod", consultationType)
  }, [consultationType, form])

  const service = services.find((s) => s.id === serviceId) ?? services[0]
  const doctorOptions = doctorsFor(service)
  const doctor =
    specialists.find((s) => s.id === specialistId) ?? doctorOptions[0] ?? specialists[0]
  const day = initialDates.find((d) => d.date === selectedDate)
  const slotGroups = (["morning", "afternoon", "evening"] as const)
    .map((p) => ({
      period: p,
      slots: (day?.slots ?? []).filter((s) => s.period === p),
    }))
    .filter((g) => g.slots.length > 0)

  // Filtered departments for Step 1
  const filteredServices = React.useMemo(() => {
    let list = services
    if (departmentSearch.trim()) {
      const q = departmentSearch.toLowerCase().trim()
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q)
      )
    }
    return list
  }, [services, departmentSearch])

  // Filtered doctors for Step 2
  const filteredDoctors = React.useMemo(() => {
    let list = doctorOptions
    if (doctorSearch.trim()) {
      const q = doctorSearch.toLowerCase().trim()
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.title.toLowerCase().includes(q) ||
          d.bio.toLowerCase().includes(q) ||
          d.specialties.some((s) => s.toLowerCase().includes(q))
      )
    }
    if (doctorFilter === "today") {
      list = list.filter((d) => d.nextAvailableSlot.toLowerCase().includes("today"))
    } else if (doctorFilter === "top_rated") {
      list = list.filter((d) => d.rating >= 4.95)
    }
    return list
  }, [doctorOptions, doctorSearch, doctorFilter])

  const canContinue =
    step === 1
      ? !!service
      : step === 2
      ? !!doctor
      : step === 3
      ? !!selectedDate && !!selectedTime
      : true

  const goTo = (next: Step) => {
    setStep(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const pickService = (id: string) => {
    setServiceId(id)
    const svc = services.find((s) => s.id === id)
    const options = doctorsFor(svc)
    if (!options.some((d) => d.id === specialistId)) {
      setSpecialistId(options[0]?.id ?? "")
    }
    goTo(2)
  }

  const pickDoctor = (id: string) => {
    setSpecialistId(id)
    goTo(3)
  }

  const handleCopyRef = (refText: string) => {
    navigator.clipboard.writeText(refText)
    setCopiedRef(true)
    setTimeout(() => setCopiedRef(false), 2000)
  }

  const onSubmit = async (values: CustomerInfoFormValues) => {
    setIsSubmitting(true)
    try {
      const apt = await AppointmentService.createAppointment({
        serviceId: service.id,
        specialistId: doctor.id,
        consultationType,
        date: selectedDate,
        time: selectedTime,
        customer: {
          ...values,
          bookingFor,
          insuranceType: insurancePreference,
        },
      })
      setConfirmed(apt)
      goTo("confirmed")
    } catch (err) {
      console.error("Booking failed", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const downloadIcs = () => {
    if (!confirmed) return
    const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MedPulse Health//Clinical Appointment//EN
BEGIN:VEVENT
UID:${confirmed.referenceNumber}@medpulse.health
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
SUMMARY:MedPulse: ${confirmed.serviceTitle} with ${confirmed.specialistName}
DESCRIPTION:Physician: ${confirmed.specialistName} (${confirmed.specialistTitle})\\nVisit Format: ${
      confirmed.consultationType === "video" ? "Telehealth HD Video" : "In-Person Hospital Visit"
    }\\n${
      confirmed.consultationType === "video"
        ? `Meeting Link: ${confirmed.meetingLink}`
        : `Address: ${confirmed.locationAddress}`
    }
LOCATION:${
      confirmed.consultationType === "video"
        ? "Telehealth Video Link"
        : confirmed.locationAddress || "MedPulse Hospital Main Clinic"
    }
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`
    const url = URL.createObjectURL(
      new Blob([ics], { type: "text/calendar;charset=utf-8" })
    )
    const a = document.createElement("a")
    a.href = url
    a.download = `MedPulse-${confirmed.referenceNumber}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  /* ───────────────────────── Confirmation Screen ───────────────────────── */
  if (step === "confirmed" && confirmed) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header celebration banner */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.5, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
              className="h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10"
            >
              <Check className="h-10 w-10" />
            </motion.div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 font-bold bg-emerald-500/10 px-3 py-1 rounded-full">
                Appointment Confirmed
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground pt-2">
                You&apos;re scheduled with {confirmed.specialistName}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                A calendar invitation and clinical check-in guide have been sent to{" "}
                <strong className="text-foreground">{confirmed.customer.email}</strong>.
              </p>
            </div>
          </div>

          {/* Digital Boarding Pass / Clinical Slip */}
          <div className="rounded-3xl border border-border bg-card shadow-lg overflow-hidden relative">
            <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-6 sm:p-8 border-b border-border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={confirmed.specialistAvatar}
                    alt={confirmed.specialistName}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover ring-2 ring-background shadow-md shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-primary">
                      {confirmed.serviceTitle}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      {confirmed.specialistName}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {confirmed.specialistTitle}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-background/80 border border-border sm:text-right shrink-0">
                  <span className="block text-[10px] font-mono uppercase text-muted-foreground font-semibold">
                    Appointment Reference
                  </span>
                  <div className="flex items-center gap-2 font-mono font-bold text-base text-foreground mt-0.5">
                    <span>{confirmed.referenceNumber}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyRef(confirmed.referenceNumber)}
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      title="Copy Reference Number"
                    >
                      {copiedRef ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Slip Core Details */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
                  <span className="block text-[10px] uppercase text-muted-foreground font-semibold">
                    Date
                  </span>
                  <span className="block text-sm font-bold text-foreground mt-1">
                    {confirmed.dateFormatted}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
                  <span className="block text-[10px] uppercase text-muted-foreground font-semibold">
                    Scheduled Time
                  </span>
                  <span className="block text-sm font-bold text-foreground mt-1">
                    {confirmed.time}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
                  <span className="block text-[10px] uppercase text-muted-foreground font-semibold">
                    Visit Format
                  </span>
                  <span className="block text-sm font-bold text-foreground capitalize mt-1">
                    {confirmed.consultationType.replace("_", " ")}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
                  <span className="block text-[10px] uppercase text-muted-foreground font-semibold">
                    Patient Name
                  </span>
                  <span className="block text-sm font-bold text-foreground truncate mt-1">
                    {confirmed.customer.firstName} {confirmed.customer.lastName}
                  </span>
                </div>
              </div>

              {/* Location or Telehealth Specific Guidance */}
              {confirmed.consultationType === "video" ? (
                <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5 font-bold text-sm text-foreground">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Video className="h-4 w-4" />
                      </div>
                      <span>Encrypted HD Telehealth Video Consultation</span>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono border-primary/30 text-primary">
                      HIPAA Compliant
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You can join from any smartphone, tablet, or laptop browser without installing an app. The encrypted consultation link unlocks 10 minutes prior to your visit.
                  </p>
                  <div className="pt-1">
                    <a
                      href={confirmed.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs"
                    >
                      <span>Open Telehealth Room</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              ) : confirmed.consultationType === "phone" ? (
                <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
                  <div className="flex items-center gap-2.5 font-bold text-sm text-foreground">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Phone className="h-4 w-4" />
                    </div>
                    <span>Direct Telephone Medical Consultation</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {confirmed.specialistName} will call your phone at <strong>{confirmed.customer.phone}</strong> at {confirmed.time}. Please ensure your ringer is on.
                  </p>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-2">
                  <div className="flex items-center gap-2.5 font-bold text-sm text-foreground">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span>Hospital Outpatient Clinical Pavilion</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {confirmed.locationAddress || "MedPulse Hospital Main Campus · 742 Healthcare Ave, Floor 4, Suite 402"}. Free valet parking and check-in kiosks are available at Pavilion Entrance B.
                  </p>
                </div>
              )}

              {/* What to bring / Preparation tips */}
              <div className="pt-2 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Bring a photo ID and health insurance card for check-in.</span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Free reschedule or cancellation up to 24 hours prior.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CreditCard className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>$0 collected today. Co-pay or insurance billed post-visit.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Post-Booking Authentication Requirement */}
          {!isAuthenticated ? (
            <div className="p-6 rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold shadow-xs">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-primary/40 text-primary text-[10px] font-mono">
                        Action Required
                      </Badge>
                      <span className="text-xs font-mono text-muted-foreground">
                        Customer Portal Security
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-foreground">
                      Sign In to Activate Your Patient Portal
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                      Your appointment has been reserved! To access your live digital boarding pass, receive appointment updates, and enter the telehealth room, please sign in.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <Button
                    onClick={() => {
                      loginAs(
                        "patient",
                        confirmed.customer.email,
                        `${confirmed.customer.firstName} ${confirmed.customer.lastName}`
                      )
                    }}
                    className="h-11 px-5 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-sm"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Log In as {confirmed.customer.firstName}</span>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="h-11 px-4 text-xs font-semibold rounded-xl border-border gap-2"
                  >
                    <Link href={`/login?redirect=/portal`}>
                      <User className="h-4 w-4" />
                      <span>Existing Account</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>
                  Signed in as <strong className="font-semibold">{user?.name}</strong>. This appointment is synced to your Customer Care Portal.
                </span>
              </div>
              <Button asChild size="sm" className="h-8 text-xs rounded-xl shrink-0">
                <Link href="/portal">Go to Portal</Link>
              </Button>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <a
              href={getGoogleCalendarUrl(confirmed)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-border bg-card text-foreground text-xs font-semibold hover:bg-muted transition-colors shadow-xs"
            >
              <CalendarPlus className="h-4 w-4 text-primary" />
              <span>Add to Google Calendar</span>
            </a>

            <Button
              onClick={downloadIcs}
              variant="outline"
              className="h-11 gap-2 text-xs font-semibold rounded-xl"
            >
              <Calendar className="h-4 w-4 text-primary" />
              <span>Download iCal (.ics)</span>
            </Button>

            <Button asChild className="h-11 gap-2 text-xs font-semibold rounded-xl">
              <Link href="/portal">
                <span>View in Patient Portal</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="ghost" className="h-11 gap-2 text-xs rounded-xl">
              <Link href="/specialists">
                <span>Find Another Doctor</span>
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  const currentN = step as number

  /* ───────────────────────── Interactive Wizard ───────────────────────── */
  return (
    <div className="space-y-8">
      {/* Pre-selected Doctor Alert (if arriving from doctor directory) */}
      {initial.doctor && step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary/20 shadow-sm shrink-0"
            />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                  Selected Specialist
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  {doctor.role}
                </span>
              </div>
              <h3 className="font-bold text-base text-foreground">
                {doctor.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {doctor.title} · <strong className="text-emerald-600 font-semibold">{doctor.nextAvailableSlot}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => goTo(2)}
              className="text-xs h-9 rounded-xl font-medium"
            >
              Change Doctor
            </Button>
          </div>
        </motion.div>
      )}

      {/* Interactive Step Navigator */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Book a Clinical Consultation
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Four quick steps · No credit card required upfront · Instant hospital confirmation
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-primary/10 text-primary">
            <Clock className="h-3.5 w-3.5" /> Takes ~2 mins
          </span>
        </div>

        {/* Step Track */}
        <ol className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {STEPS.map((s) => {
            const done = s.n < currentN
            const active = s.n === currentN
            return (
              <li key={s.n}>
                <button
                  type="button"
                  disabled={!done}
                  onClick={() => goTo(s.n as Step)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    active
                      ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                      : done
                      ? "border-border bg-muted/20 hover:bg-muted/40"
                      : "border-border/60 bg-muted/5 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        done
                          ? "bg-primary text-primary-foreground"
                          : active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {done ? <Check className="h-3.5 w-3.5" /> : s.n}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">
                      Step 0{s.n}
                    </span>
                  </div>
                  <span className="block text-xs font-bold text-foreground">
                    {s.label}
                  </span>
                  <span className="block text-[11px] text-muted-foreground truncate">
                    {s.desc}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Main Grid: Wizard Steps (Col 8) + Live Summary (Col 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step Content */}
        <div className="lg:col-span-8 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={String(step)}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}
              className="space-y-6"
            >
              {/* STEP 1 — Department Selection */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <StepHeader
                      title="Select clinical department"
                      subtitle="Choose your clinical specialty. We'll connect you with board-certified physicians."
                    />

                    {/* Department search */}
                    <div className="relative w-full sm:w-64 shrink-0">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        type="text"
                        value={departmentSearch}
                        onChange={(e) => setDepartmentSearch(e.target.value)}
                        placeholder="Search departments..."
                        className="pl-9 h-10 text-xs rounded-xl bg-card border-border shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Department Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredServices.map((s) => {
                      const Icon = SERVICE_ICONS[s.id] ?? Stethoscope
                      const selected = s.id === serviceId
                      const docs = doctorsFor(s)
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => pickService(s.id)}
                          className={`text-left rounded-2xl border p-5 flex flex-col justify-between transition-all hover:border-primary hover:shadow-md cursor-pointer group ${
                            selected
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border bg-card hover:bg-muted/30"
                          }`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                                <Icon className="h-6 w-6" />
                              </span>
                              {s.badge && (
                                <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                                  {s.badge}
                                </Badge>
                              )}
                            </div>

                            <div>
                              <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                                {s.title}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                {s.shortDescription}
                              </p>
                            </div>
                          </div>

                          <div className="pt-4 mt-4 border-t border-border/80 flex items-center justify-between text-xs font-mono">
                            <span className="text-primary font-semibold">
                              {s.feeDisplay}
                            </span>
                            <span className="text-muted-foreground flex items-center gap-1">
                              <span>{docs.length} Doctors</span>
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2 — Doctor Selection */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <StepHeader
                      title="Choose attending physician"
                      subtitle={`Top specialists affiliated with ${service.title}.`}
                    />

                    {/* Search */}
                    <div className="relative w-full sm:w-64 shrink-0">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        type="text"
                        value={doctorSearch}
                        onChange={(e) => setDoctorSearch(e.target.value)}
                        placeholder="Search doctor or credential..."
                        className="pl-9 h-10 text-xs rounded-xl bg-card border-border shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Quick Filters Strip */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {[
                      { id: "all", label: "All Specialists" },
                      { id: "today", label: "Available Today" },
                      { id: "top_rated", label: "Top Rated (4.95+ ★)" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setDoctorFilter(f.id as any)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition-colors cursor-pointer shrink-0 ${
                          doctorFilter === f.id
                            ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
                            : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Doctor Cards List */}
                  <div className="space-y-3.5">
                    {filteredDoctors.map((d) => {
                      const selected = d.id === specialistId
                      const isToday = d.nextAvailableSlot.toLowerCase().includes("today")
                      const isExpanded = expandedDoctorBio === d.id

                      return (
                        <div
                          key={d.id}
                          className={`rounded-2xl border transition-all p-5 bg-card hover:shadow-md ${
                            selected
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                            {/* Doctor info */}
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                              <div className="relative shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={d.avatar}
                                  alt={d.name}
                                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover ring-1 ring-border"
                                />
                                {isToday && (
                                  <span
                                    title="Available Today"
                                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background"
                                  >
                                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                  </span>
                                )}
                              </div>

                              <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-bold text-base sm:text-lg text-foreground">
                                    {d.name}
                                  </h3>
                                  <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold bg-muted/60 px-2 py-0.5 rounded">
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    {d.rating}
                                    <span className="text-muted-foreground font-normal">
                                      ({d.reviewCount})
                                    </span>
                                  </span>
                                </div>

                                <p className="text-xs text-primary font-medium">
                                  {d.title} · <span className="text-muted-foreground">{d.role}</span>
                                </p>

                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {d.education || d.bio}
                                </p>

                                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-muted-foreground">
                                  <span>{d.experienceYears}y practice</span>
                                  <span>·</span>
                                  <span className={isToday ? "text-emerald-600 font-semibold" : "text-muted-foreground"}>
                                    Earliest: {d.nextAvailableSlot}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Select CTA */}
                            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0">
                              <Button
                                type="button"
                                onClick={() => pickDoctor(d.id)}
                                className="text-xs h-10 px-6 font-semibold rounded-xl w-full sm:w-auto"
                              >
                                {selected ? "Selected" : "Select Physician"}
                              </Button>

                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedDoctorBio(isExpanded ? null : d.id)
                                }
                                className="text-[11px] font-mono text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                              >
                                {isExpanded ? "Hide Details ▲" : "View Bio & Credentials ▼"}
                              </button>
                            </div>
                          </div>

                          {/* Expandable bio & credentials */}
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-border/80 text-xs space-y-3"
                            >
                              <p className="text-muted-foreground leading-relaxed">
                                {d.bio}
                              </p>
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">
                                  Credentials & Education
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {d.credentials.map((cred, idx) => (
                                    <span
                                      key={idx}
                                      className="border border-border/80 px-2 py-0.5 rounded bg-muted/40 font-mono text-[11px]"
                                    >
                                      {cred}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3 — Format, Date & Time Selection */}
              {step === 3 && (
                <div className="space-y-8">
                  <StepHeader
                    title="Select format, date & time"
                    subtitle={`Confirmed physician: ${doctor.name}. Select your preferred appointment format and time slot.`}
                  />

                  {/* Consultation Format Selector */}
                  <div className="space-y-3">
                    <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                      Consultation Format
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      {[
                        {
                          id: "in_person",
                          label: "In-Person Clinic",
                          sub: "MedPulse Hospital Main Campus, Suite 400",
                          icon: Building2,
                        },
                        {
                          id: "video",
                          label: "HD Video Telehealth",
                          sub: "Encrypted video room from any device",
                          icon: Video,
                        },
                        {
                          id: "phone",
                          label: "Telephone Medical",
                          sub: "Physician calls your mobile directly",
                          icon: Phone,
                        },
                      ].map((o) => {
                        const active = consultationType === o.id
                        return (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() => setConsultationType(o.id as any)}
                            className={`rounded-2xl border p-4 text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                              active
                                ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                                : "border-border bg-card hover:border-primary/60 hover:bg-muted/30"
                            }`}
                          >
                            <span
                              className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                                active
                                  ? "bg-primary text-primary-foreground shadow-xs"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              <o.icon className="h-5 w-5" />
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="block text-sm font-bold text-foreground">
                                {o.label}
                              </span>
                              <span className="block text-xs text-muted-foreground mt-0.5 leading-snug">
                                {o.sub}
                              </span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* 14-Day Date Selector */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                        Select Appointment Date
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const earliest = initialDates.find((d) => d.isAvailable)
                          if (earliest) {
                            setSelectedDate(earliest.date)
                            setSelectedTime("")
                          }
                        }}
                        className="text-xs font-mono font-semibold text-primary hover:underline cursor-pointer"
                      >
                        ⚡ Jump to Earliest Slot
                      </button>
                    </div>

                    <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar snap-x">
                      {initialDates.slice(0, 14).map((d) => {
                        const active = d.date === selectedDate
                        return (
                          <button
                            key={d.date}
                            type="button"
                            disabled={!d.isAvailable}
                            onClick={() => {
                              setSelectedDate(d.date)
                              setSelectedTime("")
                            }}
                            className={`snap-start shrink-0 w-18 sm:w-20 rounded-2xl border py-3 text-center transition-all cursor-pointer ${
                              !d.isAvailable
                                ? "opacity-30 cursor-not-allowed border-border line-through bg-muted/10"
                                : active
                                ? "border-primary bg-primary text-primary-foreground shadow-md font-bold scale-102"
                                : "border-border bg-card hover:border-primary hover:bg-muted/40"
                            }`}
                          >
                            <span className="block text-[11px] uppercase font-mono opacity-80 font-medium">
                              {d.dayName}
                            </span>
                            <span className="block text-xl font-bold leading-tight mt-0.5">
                              {d.dayNumber}
                            </span>
                            <span className="block text-[10px] font-mono mt-1 opacity-70">
                              {d.isAvailable ? `${d.slots.length} slots` : "Booked"}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Available Time Slots by Period */}
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                        Available Time Openings · {formatDay(selectedDate)}
                      </p>
                      {selectedTime && (
                        <span className="text-xs font-mono font-bold text-primary">
                          Selected: {selectedTime}
                        </span>
                      )}
                    </div>

                    {slotGroups.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                        No appointments open on this day. Please select another date above.
                      </div>
                    ) : (
                      slotGroups.map((g) => {
                        const meta = PERIOD_META[g.period]
                        return (
                          <div key={g.period} className="space-y-2.5">
                            <p className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                              <meta.icon className="h-3.5 w-3.5 text-primary" />
                              <span className="font-semibold text-foreground">
                                {meta.label}
                              </span>
                              <span>· {meta.desc}</span>
                            </p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                              {g.slots.map((slot) => {
                                const active = selectedTime === slot.time
                                return (
                                  <button
                                    key={slot.id}
                                    type="button"
                                    disabled={!slot.available}
                                    onClick={() => setSelectedTime(slot.time)}
                                    className={`rounded-xl border py-2.5 px-2 text-xs font-mono font-medium transition-all cursor-pointer text-center ${
                                      !slot.available
                                        ? "opacity-35 cursor-not-allowed line-through border-border bg-muted/10"
                                        : active
                                        ? "border-primary bg-primary text-primary-foreground shadow-sm font-bold scale-102"
                                        : "border-border bg-card hover:border-primary hover:bg-muted/40"
                                    }`}
                                  >
                                    {slot.time}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4 — Patient Details & Clinical Intake */}
              {step === 4 && (
                <div className="space-y-6">
                  <StepHeader
                    title="Patient intake & clinical contact"
                    subtitle="We'll send calendar confirmations and prepare your medical chart prior to your visit."
                  />

                  {/* Booking For Toggle: Self vs Dependent */}
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                      Who is this appointment for?
                    </span>
                    <div className="grid grid-cols-2 gap-3 max-w-sm">
                      <button
                        type="button"
                        onClick={() => setBookingFor("self")}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          bookingFor === "self"
                            ? "bg-primary text-primary-foreground border-primary shadow-xs"
                            : "bg-card border-border text-foreground hover:bg-muted/30"
                        }`}
                      >
                        <User className="h-4 w-4" />
                        <span>For Myself</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBookingFor("dependent")}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          bookingFor === "dependent"
                            ? "bg-primary text-primary-foreground border-primary shadow-xs"
                            : "bg-card border-border text-foreground hover:bg-muted/30"
                        }`}
                      >
                        <Users className="h-4 w-4" />
                        <span>Family Member</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Reason Suggestions */}
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                      Common Consultation Objectives (Click to Auto-fill)
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_REASONS.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => form.setValue("reason", r)}
                          className="text-xs px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors cursor-pointer text-muted-foreground"
                        >
                          + {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Primary Form */}
                  <Form {...form}>
                    <form
                      id="booking-form"
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4 pt-2"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium">
                                First Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Alex"
                                  className="h-11 rounded-xl bg-card border-border shadow-xs"
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
                            <FormItem>
                              <FormLabel className="text-xs font-medium">
                                Last Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Mercer"
                                  className="h-11 rounded-xl bg-card border-border shadow-xs"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
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
                              <FormLabel className="text-xs font-medium">
                                Email Address (for calendar invite & link)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="alex.mercer@gmail.com"
                                  className="h-11 rounded-xl bg-card border-border shadow-xs"
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
                            <FormItem>
                              <FormLabel className="text-xs font-medium">
                                Mobile Number (for 2h SMS reminder)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="+1 (555) 389-9921"
                                  className="h-11 rounded-xl bg-card border-border shadow-xs"
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
                          <FormItem>
                            <FormLabel className="text-xs font-medium">
                              Chief Complaint or Consultation Goal
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Describe symptoms or reasons for visit..."
                                className="h-11 rounded-xl bg-card border-border shadow-xs"
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
                          <FormItem>
                            <FormLabel className="text-xs font-medium">
                              Current Medications or Known Allergies{" "}
                              <span className="text-muted-foreground font-normal">
                                (optional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="List existing medications, drug allergies, or relevant surgical history..."
                                className="min-h-[88px] rounded-xl bg-card border-border resize-none shadow-xs"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      {/* Insurance / Billing Method Selection */}
                      <div className="space-y-2 pt-2">
                        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                          Billing & Insurance Preference
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { id: "commercial", label: "Commercial Insurance", sub: "Aetna, BCBS, United, Cigna" },
                            { id: "medicare", label: "Medicare / Medicaid", sub: "Standard coverage eligible" },
                            { id: "self_pay", label: "Self-Pay / HSA", sub: "Flat rates, $0 collected today" },
                          ].map((b) => (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => setInsurancePreference(b.id as any)}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                insurancePreference === b.id
                                  ? "bg-primary/10 border-primary text-primary font-semibold"
                                  : "bg-card border-border text-foreground hover:bg-muted/30"
                              }`}
                            >
                              <span className="block text-xs font-bold">{b.label}</span>
                              <span className="block text-[10px] text-muted-foreground mt-0.5">{b.sub}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Emergency Notice Callout */}
                      <div className="flex items-start gap-2.5 p-4 rounded-xl bg-muted/30 border border-border text-xs text-muted-foreground">
                        <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>
                          For life-threatening medical emergencies (severe chest pain, signs of stroke, difficulty breathing), please immediately call <strong>911</strong> or proceed to the nearest emergency room.
                        </span>
                      </div>
                    </form>
                  </Form>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Step Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-border flex items-center justify-between gap-3">
            {step !== 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => goTo((currentN - 1) as Step)}
                className="gap-2 text-xs font-semibold rounded-xl"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Step {currentN - 1}
              </Button>
            )}

            {step === 1 && <div />}

            {step === 3 && (
              <Button
                type="button"
                disabled={!canContinue}
                onClick={() => goTo(4)}
                className="h-11 px-8 gap-2 text-xs font-semibold rounded-xl shadow-xs"
              >
                <span>Continue to Patient Info</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}

            {step === 4 && (
              <Button
                type="submit"
                form="booking-form"
                disabled={isSubmitting}
                className="h-11 px-8 gap-2 text-xs font-semibold rounded-xl shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Securing Appointment…
                  </>
                ) : (
                  <>
                    <span>Confirm Free Reservation</span>
                    <Check className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Live Sticky Summary Sidebar */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                Appointment Summary
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Step {currentN} of 4
              </span>
            </div>

            {/* Doctor Card if selected */}
            {doctor && currentN >= 2 && (
              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/80 flex items-center gap-3.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="h-12 w-12 rounded-xl object-cover ring-1 ring-border shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground truncate">
                    {doctor.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {doctor.title}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-500 mt-0.5">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{doctor.rating}</span>
                    <span className="text-muted-foreground">({doctor.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Structured details */}
            <div className="space-y-3 text-xs">
              <div className="flex items-start justify-between gap-3">
                <span className="text-muted-foreground font-mono">Department:</span>
                <span className="font-semibold text-right text-foreground">
                  {currentN >= 1 ? service.title : "—"}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <span className="text-muted-foreground font-mono">Consultation:</span>
                <span className="font-semibold text-right text-foreground capitalize">
                  {currentN >= 3 ? consultationType.replace("_", " ") : "—"}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <span className="text-muted-foreground font-mono">Date:</span>
                <span className="font-semibold text-right text-foreground">
                  {selectedDate && currentN >= 3 ? formatDay(selectedDate) : "—"}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <span className="text-muted-foreground font-mono">Time Slot:</span>
                <span className="font-semibold text-right text-foreground font-mono">
                  {selectedTime && currentN >= 3 ? selectedTime : "—"}
                </span>
              </div>
            </div>

            {/* Pricing breakdown */}
            <div className="pt-4 border-t border-border flex items-end justify-between">
              <div>
                <span className="block text-[11px] font-mono uppercase text-muted-foreground">
                  Consultation Fee
                </span>
                <span className="text-lg font-bold font-mono text-foreground">
                  {doctor?.consultationFee || service.feeDisplay}
                </span>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                  $0 Due Today
                </span>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Billed post-consultation
                </p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-2 pt-2 border-t border-border/80 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span>256-bit encrypted HIPAA healthcare compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Free cancellation or rescheduling up to 24 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary shrink-0" />
                <span>No credit card needed to confirm time slot</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="space-y-1">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed">{subtitle}</p>
    </div>
  )
}
