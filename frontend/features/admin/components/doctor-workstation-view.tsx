"use client"

import * as React from "react"
import Link from "next/link"
import { Appointment, AppointmentStatus } from "@/types/appointment"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Stethoscope,
  Video,
  Building,
  CheckCircle2,
  Clock,
  User,
  Activity,
  FileText,
  Pill,
  Search,
  ExternalLink,
  Calendar,
  AlertCircle,
  Phone,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react"

interface DoctorWorkstationProps {
  appointments: Appointment[]
}

interface DoctorPatientQueueItem {
  id: string
  referenceNumber: string
  patientName: string
  patientAge: number
  gender: string
  time: string
  type: "video" | "in_person"
  status: "waiting" | "in_consultation" | "completed"
  reason: string
  vitals: {
    bp: string
    pulse: number
    spO2: number
    temp: string
  }
  allergies: string[]
  meetingLink?: string
  room?: string
  notes?: string
}

const INITIAL_DOCTOR_QUEUE: DoctorPatientQueueItem[] = [
  {
    id: "doc_pt_01",
    referenceNumber: "MED-2026-9041",
    patientName: "Alex Mercer",
    patientAge: 42,
    gender: "Male",
    time: "03:30 PM",
    type: "video",
    status: "waiting",
    reason: "Resting ECG follow-up and blood pressure medication titration. Reports mild exercise fatigue.",
    vitals: { bp: "128/82", pulse: 74, spO2: 98, temp: "98.4°F" },
    allergies: ["Penicillin", "Sulfa drugs"],
    meetingLink: "/consultation",
    room: "Virtual Telehealth Suite A",
    notes: "Patient adhering to low-sodium dietary plan. Logged 14-day BP logs.",
  },
  {
    id: "doc_pt_02",
    referenceNumber: "MED-2026-8812",
    patientName: "Eleanor Vance",
    patientAge: 58,
    gender: "Female",
    time: "04:15 PM",
    type: "in_person",
    status: "waiting",
    reason: "Post-stent 6-month angiogram review and recurrent exertional dyspnea check.",
    vitals: { bp: "134/86", pulse: 68, spO2: 97, temp: "98.6°F" },
    allergies: ["Aspirin", "Iodine contrast (mild)"],
    room: "Exam Room 402B · West Cardiac Wing",
    notes: "Needs repeat echocardiogram order and cholesterol panel.",
  },
  {
    id: "doc_pt_03",
    referenceNumber: "MED-2026-8794",
    patientName: "Marcus Sterling",
    patientAge: 35,
    gender: "Male",
    time: "05:00 PM",
    type: "video",
    status: "waiting",
    reason: "Holter monitor 48-hour telemetry read and benign PVC palpitation reassurance.",
    vitals: { bp: "120/78", pulse: 72, spO2: 99, temp: "98.2°F" },
    allergies: ["None known"],
    meetingLink: "/consultation",
    room: "Virtual Telehealth Suite B",
  },
  {
    id: "doc_pt_04",
    referenceNumber: "MED-2026-8104",
    patientName: "Sophia Hernandez",
    patientAge: 29,
    gender: "Female",
    time: "01:15 PM",
    type: "in_person",
    status: "completed",
    reason: "Athletic cardiovascular clearance & sinus arrhythmia evaluation.",
    vitals: { bp: "114/72", pulse: 56, spO2: 100, temp: "98.5°F" },
    allergies: ["Latex"],
    room: "Exam Room 402B",
    notes: "Physiological sinus bradycardia common in endurance athletes. Cleared for marathon.",
  },
  {
    id: "doc_pt_05",
    referenceNumber: "MED-2026-7991",
    patientName: "Robert Davis",
    patientAge: 64,
    gender: "Male",
    time: "02:00 PM",
    type: "video",
    status: "completed",
    reason: "Heart failure with preserved ejection fraction (HFpEF) monthly titration.",
    vitals: { bp: "126/80", pulse: 66, spO2: 96, temp: "98.1°F" },
    allergies: ["Codeine"],
    meetingLink: "/consultation",
    room: "Virtual Telehealth Suite A",
  },
]

interface RxRefillItem {
  id: string
  patientName: string
  medication: string
  dosage: string
  instructions: string
  rxNumber: string
  status: "pending" | "approved"
}

const INITIAL_RX_REFILLS: RxRefillItem[] = [
  {
    id: "rx_1",
    patientName: "Alex Mercer",
    medication: "Atorvastatin Calcium",
    dosage: "20 mg Oral Tablet",
    instructions: "Once daily at bedtime · 90-day supply (3 refills remaining)",
    rxNumber: "RX-884102",
    status: "pending",
  },
  {
    id: "rx_2",
    patientName: "Eleanor Vance",
    medication: "Metoprolol Succinate ER",
    dosage: "50 mg Extended Release Tablet",
    instructions: "Once daily with morning meal · 30-day supply (2 refills remaining)",
    rxNumber: "RX-419208",
    status: "pending",
  },
]

export function DoctorWorkstationView({ appointments }: DoctorWorkstationProps) {
  const [queue, setQueue] = React.useState<DoctorPatientQueueItem[]>(INITIAL_DOCTOR_QUEUE)
  const [activeFilter, setActiveFilter] = React.useState<"all" | "video" | "in_person" | "completed">("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [roomStatus, setRoomStatus] = React.useState<"available" | "in_session" | "charting">("available")
  const [refills, setRefills] = React.useState<RxRefillItem[]>(INITIAL_RX_REFILLS)

  // SOAP Note modal state
  const [selectedPatientForSoap, setSelectedPatientForSoap] = React.useState<DoctorPatientQueueItem | null>(null)
  const [soapSubjective, setSoapSubjective] = React.useState("")
  const [soapObjective, setSoapObjective] = React.useState("")
  const [soapAssessment, setSoapAssessment] = React.useState("")
  const [soapPlan, setSoapPlan] = React.useState("")
  const [soapSavedNotice, setSoapSavedNotice] = React.useState<string | null>(null)

  const openSoapModal = (patient: DoctorPatientQueueItem) => {
    setSelectedPatientForSoap(patient)
    setSoapSubjective(patient.reason || "Patient presents for regular cardiology review.")
    setSoapObjective(`Resting vitals: BP ${patient.vitals.bp} mmHg, HR ${patient.vitals.pulse} bpm, SpO2 ${patient.vitals.spO2}%, Temp ${patient.vitals.temp}. Auscultation clear, regular rhythm without murmurs.`)
    setSoapAssessment("Hypertension well-controlled on current therapy; resting ECG unchanged from baseline.")
    setSoapPlan("Continue current prescription regimen. Recheck lipid panel & comprehensive metabolic panel in 6 months.")
  }

  const saveSoapNote = () => {
    if (!selectedPatientForSoap) return
    setSoapSavedNotice(`Clinical SOAP Note for ${selectedPatientForSoap.patientName} saved to EHR.`)
    setTimeout(() => {
      setSoapSavedNotice(null)
      setSelectedPatientForSoap(null)
    }, 1500)
  }

  const updatePatientStatus = (id: string, newStatus: "waiting" | "in_consultation" | "completed") => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    )
  }

  const approveRefill = (id: string) => {
    setRefills((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
    )
  }

  // Filter queue
  const filteredQueue = queue.filter((item) => {
    const matchesSearch =
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeFilter === "video") return matchesSearch && item.type === "video"
    if (activeFilter === "in_person") return matchesSearch && item.type === "in_person"
    if (activeFilter === "completed") return matchesSearch && item.status === "completed"
    return matchesSearch
  })

  const nextPatient = queue.find((p) => p.status === "waiting") || queue[0]

  return (
    <div className="space-y-8">
      {/* 1. Doctor Header & Room Availability Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-border pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            <Stethoscope className="h-4 w-4" />
            <span>Physician Clinical Workstation</span>
            <Badge variant="outline" className="border-primary/30 text-primary font-mono text-[10px]">
              MD-1029
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Dr. Sarah Ahmed, MD, FACC
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>Chief Cardiologist & Attending Physician</span>
            <span>·</span>
            <span>West Cardiac Wing · Consultation Room 402B</span>
            <span>·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">On-Duty Shift Active</span>
          </p>
        </div>

        {/* Room 402B Live Status Control */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="p-1 rounded-xl bg-muted/50 border border-border flex items-center gap-1 text-xs font-mono">
            <span className="px-2.5 py-1 text-muted-foreground font-semibold">Room Status:</span>
            {(
              [
                { id: "available", label: "Available", color: "bg-emerald-500 text-white" },
                { id: "in_session", label: "In Consult", color: "bg-blue-600 text-white" },
                { id: "charting", label: "Charting", color: "bg-amber-500 text-white" },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setRoomStatus(s.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  roomStatus === s.id
                    ? `${s.color} shadow-xs font-bold scale-[1.02]`
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <Button
            asChild
            className="h-10 text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-xs"
          >
            <Link href="/consultation">
              <Video className="h-4 w-4" />
              <span>Enter Telehealth Room</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Doctor KPIs Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-border border-b border-border pb-8">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase text-muted-foreground">
            Scheduled Today
          </span>
          <p className="text-3xl sm:text-4xl font-bold font-mono text-foreground">
            {queue.length}
          </p>
          <span className="text-xs font-mono text-primary font-semibold block">
            {queue.filter((q) => q.status === "waiting").length} Pending Consultation
          </span>
        </div>

        <div className="space-y-1 pt-4 lg:pt-0 lg:pl-6">
          <span className="text-xs font-mono uppercase text-muted-foreground">
            Telehealth Encounters
          </span>
          <p className="text-3xl sm:text-4xl font-bold font-mono text-foreground">
            {queue.filter((q) => q.type === "video").length}
          </p>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold block">
            100% Encrypted WebRTC
          </span>
        </div>

        <div className="space-y-1 pt-4 lg:pt-0 lg:pl-6">
          <span className="text-xs font-mono uppercase text-muted-foreground">
            Rx Refills Pending
          </span>
          <p className="text-3xl sm:text-4xl font-bold font-mono text-foreground">
            {refills.filter((r) => r.status === "pending").length}
          </p>
          <span className="text-xs font-mono text-amber-500 font-semibold block">
            Requires Doctor Signature
          </span>
        </div>

        <div className="space-y-1 pt-4 lg:pt-0 lg:pl-6">
          <span className="text-xs font-mono uppercase text-muted-foreground">
            Completed Visits
          </span>
          <p className="text-3xl sm:text-4xl font-bold font-mono text-foreground">
            {queue.filter((q) => q.status === "completed").length}
          </p>
          <span className="text-xs font-mono text-muted-foreground font-semibold block">
            Average 22 min / encounter
          </span>
        </div>
      </div>

      {/* 3. "Up Next" Priority Patient Spotlight */}
      {nextPatient && (
        <Card className="border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-card rounded-2xl overflow-hidden shadow-sm">
          <CardHeader className="pb-3 border-b border-border/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                  Next Patient in Queue
                </span>
                <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                  {nextPatient.time} Today
                </Badge>
              </div>
              <Badge className="w-fit text-xs font-mono bg-primary text-primary-foreground">
                {nextPatient.type === "video" ? "Telehealth Video Encounter" : "Clinic Room 402B"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold text-base">
                    {nextPatient.patientName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {nextPatient.patientName}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      Ref: {nextPatient.referenceNumber} · {nextPatient.patientAge} yrs · {nextPatient.gender}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-foreground/90 font-medium">
                  {nextPatient.reason}
                </p>

                {/* Vitals summary bar */}
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono bg-background/80 p-3 rounded-xl border border-border">
                  <div className="flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-primary" />
                    <span className="text-muted-foreground">BP:</span>
                    <span className="font-bold text-foreground">{nextPatient.vitals.bp} mmHg</span>
                  </div>
                  <span className="text-border">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">Pulse:</span>
                    <span className="font-bold text-foreground">{nextPatient.vitals.pulse} bpm</span>
                  </div>
                  <span className="text-border">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">SpO2:</span>
                    <span className="font-bold text-foreground">{nextPatient.vitals.spO2}%</span>
                  </div>
                  <span className="text-border">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">Temp:</span>
                    <span className="font-bold text-foreground">{nextPatient.vitals.temp}</span>
                  </div>
                  {nextPatient.allergies.length > 0 && (
                    <>
                      <span className="text-border">|</span>
                      <div className="flex items-center gap-1.5 text-rose-500 font-semibold">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>Allergies: {nextPatient.allergies.join(", ")}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons for Next Patient */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
                {nextPatient.type === "video" ? (
                  <Button
                    asChild
                    className="h-11 px-5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold gap-2 shadow-md cursor-pointer"
                  >
                    <Link href="/consultation">
                      <Video className="h-4 w-4" />
                      <span>Launch Video Consultation</span>
                    </Link>
                  </Button>
                ) : (
                  <Button
                    onClick={() => updatePatientStatus(nextPatient.id, "in_consultation")}
                    className="h-11 px-5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold gap-2 shadow-md cursor-pointer"
                  >
                    <Building className="h-4 w-4" />
                    <span>Call Patient into Room 402B</span>
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => openSoapModal(nextPatient)}
                  className="h-10 text-xs font-mono border-border gap-1.5 rounded-xl cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  <span>Clinical SOAP Note</span>
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => updatePatientStatus(nextPatient.id, "completed")}
                  className="h-9 text-xs text-muted-foreground hover:text-emerald-600 gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Mark Completed</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. Consultation Queue & Pending Rx Refills Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Full Patient Queue (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                My Consultation Queue Today
              </h2>
              <p className="text-xs text-muted-foreground">
                Assigned cardiology clinic consultations & scheduled telehealth video sessions.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-border text-xs font-mono">
              {(
                [
                  { id: "all", label: "All" },
                  { id: "video", label: "Telehealth" },
                  { id: "in_person", label: "In-Person" },
                  { id: "completed", label: "Done" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeFilter === tab.id
                      ? "bg-card text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Filter by patient name, reference number, or condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs bg-card border-border font-mono rounded-xl"
            />
          </div>

          {/* Queue List Cards */}
          <div className="space-y-3">
            {filteredQueue.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all space-y-3 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center font-bold text-xs text-foreground">
                      {item.patientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">
                          {item.patientName}
                        </span>
                        <Badge variant="outline" className="text-[10px] font-mono border-border">
                          {item.patientAge}y · {item.gender}
                        </Badge>
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {item.referenceNumber} · {item.room}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono capitalize ${
                        item.type === "video"
                          ? "border-primary/40 text-primary bg-primary/5"
                          : "border-teal-500/40 text-teal-600 bg-teal-500/5"
                      }`}
                    >
                      {item.type === "video" ? (
                        <span className="flex items-center gap-1">
                          <Video className="h-3 w-3" /> Telehealth
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3" /> In-Person
                        </span>
                      )}
                    </Badge>

                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-mono capitalize ${
                        item.status === "completed"
                          ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                          : item.status === "in_consultation"
                          ? "bg-blue-500/15 text-blue-600 border border-blue-500/30"
                          : "bg-amber-500/15 text-amber-600 border border-amber-500/30"
                      }`}
                    >
                      {item.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-foreground/80 leading-relaxed font-sans">
                  {item.reason}
                </p>

                {/* Vitals & Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/60 text-xs font-mono">
                  <div className="flex items-center gap-3 text-muted-foreground text-[11px]">
                    <span>BP: <strong className="text-foreground">{item.vitals.bp}</strong></span>
                    <span>HR: <strong className="text-foreground">{item.vitals.pulse}</strong></span>
                    <span>SpO2: <strong className="text-foreground">{item.vitals.spO2}%</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.type === "video" && item.status !== "completed" && (
                      <Button
                        asChild
                        size="sm"
                        className="h-8 text-[11px] font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
                      >
                        <Link href="/consultation">
                          <Video className="h-3.5 w-3.5" />
                          <span>Video Visit</span>
                        </Link>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openSoapModal(item)}
                      className="h-8 text-[11px] font-mono border-border rounded-lg gap-1"
                    >
                      <FileText className="h-3 w-3 text-primary" />
                      <span>SOAP Note</span>
                    </Button>

                    {item.status !== "completed" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updatePatientStatus(item.id, "completed")}
                        className="h-8 text-[11px] text-muted-foreground hover:text-emerald-600 rounded-lg"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-[10px] font-mono text-emerald-600 border-emerald-500/30">
                        Archived in EHR
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Pending Rx Refills & Clinical Tools */}
        <div className="space-y-6">
          {/* Rx Refill Requests Card */}
          <Card className="border border-border bg-card rounded-2xl shadow-2xs">
            <CardHeader className="pb-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pill className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-bold">
                    Pharmacy Refill Queue
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="text-[10px] font-mono">
                  {refills.filter((r) => r.status === "pending").length} Pending
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Electronic pharmacy authorization requests awaiting Dr. Sarah Ahmed’s sign-off.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 divide-y divide-border/60">
              {refills.map((rx) => (
                <div key={rx.id} className="py-3.5 first:pt-1 last:pb-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">
                        {rx.medication}
                      </h4>
                      <p className="text-[11px] font-mono text-primary font-medium">
                        {rx.dosage}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Patient: <strong>{rx.patientName}</strong> · {rx.rxNumber}
                      </p>
                    </div>

                    {rx.status === "approved" ? (
                      <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/40 text-emerald-600 bg-emerald-500/10">
                        Authorized
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => approveRefill(rx.id)}
                        className="h-7 text-[10px] font-mono rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                      >
                        Sign & Approve
                      </Button>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    {rx.instructions}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Doctor Resources & Guidelines */}
          <Card className="border border-border bg-muted/20 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Attending Physician Checklist</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2 font-mono text-[11px]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>All video sessions recorded under HIPAA encryption standards.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>SOAP documentation must be signed within 24 hours of encounter.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Emergency cardiology hotline available on Extension 4020.</span>
              </li>
            </ul>
          </Card>
        </div>

      </div>

      {/* 5. Clinical SOAP Note Modal / Dialog */}
      <Dialog
        open={!!selectedPatientForSoap}
        onOpenChange={(open) => !open && setSelectedPatientForSoap(null)}
      >
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 text-xs font-mono text-primary font-bold">
              <FileText className="h-4 w-4" />
              <span>Electronic Medical Record · SOAP Documentation</span>
            </div>
            <DialogTitle className="text-lg font-bold">
              Clinical Note: {selectedPatientForSoap?.patientName}
            </DialogTitle>
            <DialogDescription className="text-xs font-mono">
              Encounter Ref: {selectedPatientForSoap?.referenceNumber} · Attending: Dr. Sarah Ahmed, MD
            </DialogDescription>
          </DialogHeader>

          {soapSavedNotice ? (
            <div className="py-12 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-foreground">{soapSavedNotice}</h4>
              <p className="text-xs text-muted-foreground font-mono">
                Transaction cryptographically logged to institutional EHR ledger.
              </p>
            </div>
          ) : (
            <div className="space-y-4 py-2 text-xs">
              <div className="space-y-1.5">
                <label className="font-mono uppercase font-bold text-muted-foreground text-[10px]">
                  [S] Subjective (Chief Complaint & History)
                </label>
                <Textarea
                  value={soapSubjective}
                  onChange={(e) => setSoapSubjective(e.target.value)}
                  rows={2}
                  className="text-xs font-sans rounded-xl bg-muted/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono uppercase font-bold text-muted-foreground text-[10px]">
                  [O] Objective (Vitals, Physical Exam & Diagnostics)
                </label>
                <Textarea
                  value={soapObjective}
                  onChange={(e) => setSoapObjective(e.target.value)}
                  rows={2}
                  className="text-xs font-sans rounded-xl bg-muted/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono uppercase font-bold text-muted-foreground text-[10px]">
                  [A] Assessment (Clinical Diagnosis & ICD-10 Classification)
                </label>
                <Textarea
                  value={soapAssessment}
                  onChange={(e) => setSoapAssessment(e.target.value)}
                  rows={2}
                  className="text-xs font-sans rounded-xl bg-muted/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono uppercase font-bold text-muted-foreground text-[10px]">
                  [P] Plan (Therapeutics, Rx Refill & Follow-up Interval)
                </label>
                <Textarea
                  value={soapPlan}
                  onChange={(e) => setSoapPlan(e.target.value)}
                  rows={2}
                  className="text-xs font-sans rounded-xl bg-muted/30"
                />
              </div>
            </div>
          )}

          {!soapSavedNotice && (
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPatientForSoap(null)}
                className="text-xs font-mono"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={saveSoapNote}
                className="text-xs font-semibold bg-primary text-primary-foreground gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Sign & Save to EHR</span>
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

