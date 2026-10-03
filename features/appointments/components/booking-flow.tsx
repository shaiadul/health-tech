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
  ArrowLeft,
  ArrowRight,
  Baby,
  Bone,
  Brain,
  Building,
  Calendar,
  CalendarPlus,
  Check,
  Clock,
  Heart,
  Home,
  Loader2,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Sun,
  Sunset,
  Video,
} from "lucide-react"

interface BookingFlowProps {
  services: FinancialService[]
  specialists: Specialist[]
  initialDates: DayAvailability[]
}

type Step = 1 | 2 | 3 | 4 | "confirmed"

const STEPS = [
  { n: 1, label: "Department" },
  { n: 2, label: "Doctor" },
  { n: 3, label: "Date & Time" },
  { n: 4, label: "Your Details" },
] as const

const SERVICE_ICONS: Record<string, React.ElementType> = {
  srv_cardio_01: Heart,
  srv_neuro_02: Brain,
  srv_pediatrics_03: Baby,
  srv_ortho_04: Bone,
  srv_exec_07: Sparkles,
}

const PERIOD_META = {
  morning: { label: "Morning", icon: Sun },
  afternoon: { label: "Afternoon", icon: Sun },
  evening: { label: "Evening", icon: Sunset },
} as const

function formatDay(dateStr: string) {
  if (!dateStr) return ""
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export function BookingFlow({ services, specialists, initialDates }: BookingFlowProps) {
  const searchParams = useSearchParams()

  const specialistParam = searchParams.get("specialist")
  const serviceParam = searchParams.get("service")
  const formatParam = searchParams.get("format")

  const doctorsFor = React.useCallback(
    (service?: FinancialService) => {
      if (!service) return specialists
      const matches = specialists.filter((sp) => sp.specialties.includes(service.title))
      return matches.length > 0 ? matches : specialists
    },
    [specialists]
  )

  // Resolve initial selections + starting step from deep links (hero / doctor cards)
  const initial = React.useMemo(() => {
    const doctor = specialists.find((s) => s.id === specialistParam)
    let service = services.find((s) => s.id === serviceParam)
    if (!service && doctor) {
      service = services.find((s) => doctor.specialties.includes(s.title))
    }
    const startStep: Step = doctor ? 3 : service ? 2 : 1
    return { doctor, service, startStep }
  }, [specialists, services, specialistParam, serviceParam])

  const [step, setStep] = React.useState<Step>(initial.startStep)
  const [serviceId, setServiceId] = React.useState<string>(initial.service?.id ?? services[0]?.id ?? "")
  const [specialistId, setSpecialistId] = React.useState<string>(
    initial.doctor?.id ?? doctorsFor(initial.service ?? services[0])[0]?.id ?? ""
  )
  const [consultationType, setConsultationType] = React.useState<ConsultationType>(
    formatParam === "video" ? "video" : "in_person"
  )
  const [selectedDate, setSelectedDate] = React.useState<string>(
    initialDates.find((d) => d.isAvailable)?.date ?? ""
  )
  const [selectedTime, setSelectedTime] = React.useState<string>("")
  const [confirmed, setConfirmed] = React.useState<Appointment | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

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
    },
  })

  React.useEffect(() => {
    form.setValue("contactMethod", consultationType)
  }, [consultationType, form])

  const service = services.find((s) => s.id === serviceId) ?? services[0]
  const doctorOptions = doctorsFor(service)
  const doctor = specialists.find((s) => s.id === specialistId) ?? doctorOptions[0]
  const day = initialDates.find((d) => d.date === selectedDate)
  const slotGroups = (["morning", "afternoon", "evening"] as const)
    .map((p) => ({ period: p, slots: (day?.slots ?? []).filter((s) => s.period === p) }))
    .filter((g) => g.slots.length > 0)

  const canContinue =
    step === 1 ? !!service : step === 2 ? !!doctor : step === 3 ? !!selectedDate && !!selectedTime : true

  const goTo = (next: Step) => {
    setStep(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const pickService = (id: string) => {
    setServiceId(id)
    const svc = services.find((s) => s.id === id)
    const options = doctorsFor(svc)
    if (!options.some((d) => d.id === specialistId)) setSpecialistId(options[0]?.id ?? "")
    goTo(2)
  }

  const pickDoctor = (id: string) => {
    setSpecialistId(id)
    goTo(3)
  }

  const onSubmit = async (values: CustomerInfoFormValues) => {
    setIsSubmitting(true)
    try {
      const apt = await AppointmentService.createAppointment({
        serviceId,
        specialistId: doctor.id,
        consultationType,
        date: selectedDate,
        time: selectedTime,
        customer: values,
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
DESCRIPTION:Location: ${confirmed.consultationType === "video" ? confirmed.meetingLink : confirmed.locationAddress}
LOCATION:${confirmed.consultationType === "video" ? "Telehealth Video Link" : "MedPulse Hospital Main Clinic"}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }))
    const a = document.createElement("a")
    a.href = url
    a.download = `MedPulse-${confirmed.referenceNumber}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  /* ───────────────────────── Confirmation ───────────────────────── */
  if (step === "confirmed" && confirmed) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
              className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center"
            >
              <Check className="h-7 w-7" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">You&apos;re booked.</h1>
            <p className="text-muted-foreground leading-relaxed">
              {confirmed.specialistName} will see you on{" "}
              <strong className="text-foreground">{confirmed.dateFormatted}</strong> at{" "}
              <strong className="text-foreground">{confirmed.time}</strong>. A confirmation has been
              sent to {confirmed.customer.email}.
            </p>
          </div>

          <dl className="rounded-xl border border-border divide-y divide-border text-sm">
            {[
              ["Reference", confirmed.referenceNumber],
              ["Department", confirmed.serviceTitle],
              ["Doctor", confirmed.specialistName],
              [
                "Visit type",
                confirmed.consultationType === "video" ? "Video consultation" : "In-clinic visit",
              ],
              ["Patient", `${confirmed.customer.firstName} ${confirmed.customer.lastName}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium text-right">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={downloadIcs} variant="outline" className="h-11 gap-2">
              <CalendarPlus className="h-4 w-4 text-primary" /> Add to calendar
            </Button>
            <Button asChild className="h-11 gap-2">
              <Link href="/portal">
                View in patient portal <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="h-11 gap-2">
              <Link href="/">
                <Home className="h-4 w-4" /> Home
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  const currentN = step as number

  /* ───────────────────────── Wizard ───────────────────────── */
  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title + progress */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Book an appointment</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Four quick steps. No payment needed now.
          </p>
        </div>

        <ol className="grid grid-cols-4 gap-2">
          {STEPS.map((s) => {
            const done = s.n < currentN
            const active = s.n === currentN
            return (
              <li key={s.n}>
                <button
                  type="button"
                  disabled={!done}
                  onClick={() => goTo(s.n as Step)}
                  className="w-full text-left group disabled:cursor-default"
                >
                  <div
                    className={`h-1.5 rounded-full transition-colors ${
                      done || active ? "bg-primary" : "bg-border"
                    } ${active ? "" : done ? "group-hover:bg-primary/70" : ""}`}
                  />
                  <div className="mt-2 flex items-center gap-1.5 text-xs">
                    <span
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        done
                          ? "bg-primary text-primary-foreground"
                          : active
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {done ? <Check className="h-3 w-3" /> : s.n}
                    </span>
                    <span
                      className={`hidden sm:inline font-medium ${
                        active ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Step content */}
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
              {/* STEP 1 — Department */}
              {step === 1 && (
                <>
                  <StepHeader
                    title="What do you need help with?"
                    subtitle="Choose a department. We'll show the doctors who treat it."
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.map((s) => {
                      const Icon = SERVICE_ICONS[s.id] ?? Stethoscope
                      const selected = s.id === serviceId
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => pickService(s.id)}
                          className={`text-left rounded-xl border p-4 flex gap-4 items-start transition-all hover:border-primary hover:shadow-sm ${
                            selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
                          }`}
                        >
                          <span className="h-11 w-11 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block font-semibold">{s.title}</span>
                            <span className="block text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {s.shortDescription}
                            </span>
                            <span className="block text-xs font-mono text-primary mt-2">
                              {s.feeDisplay} · {s.durationMinutes} min
                            </span>
                          </span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground mt-1" />
                        </button>
                      )
                    })}
                  </div>
                </>
              )}

              {/* STEP 2 — Doctor */}
              {step === 2 && (
                <>
                  <StepHeader
                    title="Choose your doctor"
                    subtitle={`Board-certified specialists in ${service.title}.`}
                  />
                  <div className="space-y-3">
                    {doctorOptions.map((d) => {
                      const selected = d.id === specialistId
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => pickDoctor(d.id)}
                          className={`w-full text-left rounded-xl border p-4 flex gap-4 items-center transition-all hover:border-primary hover:shadow-sm ${
                            selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={d.avatar}
                            alt={d.name}
                            className="h-16 w-16 rounded-full object-cover border border-border shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold">{d.name}</span>
                              <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold">
                                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                                {d.rating}
                                <span className="text-muted-foreground font-normal">({d.reviewCount})</span>
                              </span>
                            </div>
                            <p className="text-xs text-primary mt-0.5">{d.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {d.experienceYears} years experience ·{" "}
                              <span className="text-emerald-600 font-medium">
                                Next: {d.nextAvailableSlot}
                              </span>
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        </button>
                      )
                    })}
                  </div>
                </>
              )}

              {/* STEP 3 — Date & time */}
              {step === 3 && (
                <>
                  <StepHeader
                    title="Pick a date and time"
                    subtitle={`Appointments with ${doctor.name}.`}
                  />

                  {/* Visit type */}
                  <div className="grid grid-cols-2 gap-3">
                    {(
                      [
                        { id: "in_person", label: "In-clinic", sub: "Visit our hospital", icon: Building },
                        { id: "video", label: "Video call", sub: "From anywhere", icon: Video },
                      ] as const
                    ).map((o) => {
                      const active = consultationType === o.id
                      return (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => setConsultationType(o.id)}
                          className={`rounded-xl border p-3.5 text-left flex items-center gap-3 transition-all ${
                            active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/60"
                          }`}
                        >
                          <span
                            className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                              active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <o.icon className="h-4 w-4" />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold">{o.label}</span>
                            <span className="block text-xs text-muted-foreground">{o.sub}</span>
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Dates */}
                  <div className="space-y-2">
                    <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      Date
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
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
                            className={`snap-start shrink-0 w-16 rounded-xl border py-2.5 text-center transition-all ${
                              !d.isAvailable
                                ? "opacity-35 cursor-not-allowed border-border line-through"
                                : active
                                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                : "border-border hover:border-primary"
                            }`}
                          >
                            <span className="block text-[10px] uppercase font-mono opacity-80">
                              {d.dayName}
                            </span>
                            <span className="block text-lg font-bold leading-tight">{d.dayNumber}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Times */}
                  <div className="space-y-4">
                    {slotGroups.length === 0 && (
                      <p className="text-sm text-muted-foreground">No openings on this day.</p>
                    )}
                    {slotGroups.map((g) => {
                      const meta = PERIOD_META[g.period]
                      return (
                        <div key={g.period} className="space-y-2">
                          <p className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                            <meta.icon className="h-3.5 w-3.5" /> {meta.label}
                          </p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {g.slots.map((slot) => {
                              const active = selectedTime === slot.time
                              return (
                                <button
                                  key={slot.id}
                                  type="button"
                                  disabled={!slot.available}
                                  onClick={() => setSelectedTime(slot.time)}
                                  className={`rounded-lg border py-2.5 text-sm font-medium transition-all ${
                                    !slot.available
                                      ? "opacity-35 cursor-not-allowed line-through border-border"
                                      : active
                                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                      : "border-border hover:border-primary"
                                  }`}
                                >
                                  {slot.time}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}

              {/* STEP 4 — Details */}
              {step === 4 && (
                <>
                  <StepHeader
                    title="Tell us about you"
                    subtitle="We'll use this to confirm your visit and prepare your doctor."
                  />
                  <Form {...form}>
                    <form id="booking-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(
                          [
                            { name: "firstName", label: "First name", ph: "Alex" },
                            { name: "lastName", label: "Last name", ph: "Rahman" },
                          ] as const
                        ).map((f) => (
                          <FormField
                            key={f.name}
                            control={form.control}
                            name={f.name}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">{f.label}</FormLabel>
                                <FormControl>
                                  <Input placeholder={f.ph} className="h-11" {...field} />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="you@example.com" className="h-11" {...field} />
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
                              <FormLabel className="text-xs">Mobile number</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 555 389 9921" className="h-11" {...field} />
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
                            <FormLabel className="text-xs">Reason for visit</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. chest tightness when exercising"
                                className="h-11"
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
                            <FormLabel className="text-xs">
                              Medications & allergies{" "}
                              <span className="text-muted-foreground font-normal">(optional)</span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Anything your doctor should know"
                                className="min-h-[88px] resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer nav (steps 3–4; steps 1–2 advance on selection) */}
          {(step === 3 || step === 4) && (
            <div className="mt-8 pt-5 border-t border-border flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => goTo((currentN - 1) as Step)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>

              {step === 3 ? (
                <Button
                  type="button"
                  disabled={!canContinue}
                  onClick={() => goTo(4)}
                  className="h-11 px-8 gap-2"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" form="booking-form" disabled={isSubmitting} className="h-11 px-8 gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Booking…
                    </>
                  ) : (
                    <>
                      Confirm appointment <Check className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
          {step === 2 && (
            <div className="mt-6">
              <Button type="button" variant="ghost" onClick={() => goTo(1)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            </div>
          )}
        </div>

        {/* Live summary */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="rounded-xl border border-border bg-muted/20 p-5 space-y-4">
            <p className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
              Your appointment
            </p>

            <SummaryRow icon={Stethoscope} label="Department" value={currentN >= 2 ? service.title : "—"} />
            <SummaryRow icon={Star} label="Doctor" value={currentN >= 3 ? doctor.name : "—"} />
            <SummaryRow
              icon={Calendar}
              label="Date & time"
              value={selectedTime && currentN >= 4 ? `${formatDay(selectedDate)} · ${selectedTime}` : "—"}
            />
            <SummaryRow
              icon={consultationType === "video" ? Video : Building}
              label="Visit type"
              value={currentN >= 3 ? (consultationType === "video" ? "Video call" : "In-clinic") : "—"}
            />

            <div className="pt-4 border-t border-border flex items-end justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Consultation fee</p>
                <p className="text-lg font-bold font-mono">{service.feeDisplay}</p>
              </div>
              <p className="text-xs text-emerald-600 font-medium">Pay at visit · $0 today</p>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-muted-foreground leading-relaxed pt-1">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>Free reschedule up to 24h before. Your data is HIPAA-protected.</span>
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
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  )
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="h-8 w-8 shrink-0 rounded-md bg-background border border-border text-primary flex items-center justify-center">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm font-medium leading-snug">{value}</p>
      </div>
    </div>
  )
}
