"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  ScreenShare,
  MessageSquare,
  FileText,
  Activity,
  ShieldCheck,
  Clock,
  Sparkles,
  Send,
  Plus,
  CheckCircle2,
  Settings,
  Maximize2,
  Minimize2,
  Pill,
  Lock,
  Stethoscope,
  User,
  ArrowRight,
  Download,
  AlertCircle,
} from "lucide-react"

interface ChatMessage {
  id: string
  sender: "doctor" | "patient" | "system"
  senderName: string
  text: string
  time: string
}

interface PrescriptionItem {
  name: string
  dosage: string
  frequency: string
  duration: string
}

interface VideoRoomProps {
  roomId: string
  specialistName?: string
  specialistTitle?: string
  specialistAvatar?: string
  patientName?: string
}

export function VideoRoom({
  roomId,
  specialistName = "Dr. Sarah Ahmed, MD, FACC",
  specialistTitle = "Chief Cardiologist & Attending Physician",
  specialistAvatar = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80",
  patientName = "Alex Mercer",
}: VideoRoomProps) {
  const router = useRouter()
  const { role, user } = useAuth()

  // Hardware states
  const [isMicOn, setIsMicOn] = React.useState(true)
  const [isVideoOn, setIsVideoOn] = React.useState(true)
  const [isScreenSharing, setIsScreenSharing] = React.useState(false)
  const [activeSidebarTab, setActiveSidebarTab] = React.useState<"chat" | "vitals" | "prescription">("vitals")
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const [callDuration, setCallDuration] = React.useState(0)
  const [callEnded, setCallEnded] = React.useState(false)
  const [audioLevel, setAudioLevel] = React.useState(45)

  // Chat state
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "m_1",
      sender: "system",
      senderName: "MedPulse Telehealth",
      text: "End-to-end encrypted session established under HIPAA guidelines (256-bit AES).",
      time: "Just now",
    },
    {
      id: "m_2",
      sender: "doctor",
      senderName: specialistName.split(",")[0],
      text: `Hello ${patientName.split(" ")[0]}, welcome to our outpatient consultation. I can hear you clearly. How have your symptoms been today?`,
      time: "1m ago",
    },
  ])
  const [chatInput, setChatInput] = React.useState("")

  // Clinical SOAP Notes (for doctor role)
  const [soapNotes, setSoapNotes] = React.useState(
    "Subjective: Patient reports intermittent chest tightness during mild cardiovascular exercise over past 2 weeks.\nObjective: Blood Pressure 118/78 mmHg, Resting HR 72 bpm. SpO2 99%.\nAssessment: Mild exertional dyspnea, rule out angina. Likely stress-associated.\nPlan: Continue monitoring. Prescribing preventative low-dose medication. Order resting 12-lead ECG follow-up."
  )
  const [savedNotes, setSavedNotes] = React.useState(true)

  // Prescriptions state
  const [prescriptions, setPrescriptions] = React.useState<PrescriptionItem[]>([
    {
      name: "Metoprolol Succinate ER",
      dosage: "25 mg",
      frequency: "Once daily with breakfast",
      duration: "30 days (1 Refill)",
    },
  ])
  const [newMedName, setNewMedName] = React.useState("")
  const [newMedDosage, setNewMedDosage] = React.useState("")
  const [newMedFrequency, setNewMedFrequency] = React.useState("Once daily")
  const [isAddingMed, setIsAddingMed] = React.useState(false)

  // Timer counter
  React.useEffect(() => {
    if (callEnded) return
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1)
      // fluctuate simulated audio wave
      setAudioLevel(Math.floor(20 + Math.random() * 60))
    }, 1000)
    return () => clearInterval(interval)
  }, [callEnded])

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!chatInput.trim()) return

    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      sender: role === "doctor" ? "doctor" : "patient",
      senderName: role === "doctor" ? specialistName.split(",")[0] : patientName,
      text: chatInput.trim(),
      time: "Now",
    }
    setMessages((prev) => [...prev, newMsg])
    setChatInput("")

    // Automated doctor response simulation if patient sent message
    if (role === "patient") {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `m_reply_${Date.now()}`,
            sender: "doctor",
            senderName: specialistName.split(",")[0],
            text: "Understood. I am noting that in your clinical chart right now.",
            time: "Just now",
          },
        ])
      }, 1800)
    }
  }

  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMedName.trim()) return

    setPrescriptions((prev) => [
      ...prev,
      {
        name: newMedName.trim(),
        dosage: newMedDosage.trim() || "Standard Dose",
        frequency: newMedFrequency,
        duration: "30 days",
      },
    ])
    setNewMedName("")
    setNewMedDosage("")
    setIsAddingMed(false)
  }

  const handleEndCall = () => {
    setCallEnded(true)
  }

  // End of Call Modal
  if (callEnded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-2xl"
        >
          <div className="text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto ring-4 ring-emerald-500/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Consultation Complete
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Session Duration: <strong className="text-foreground">{formatTimer(callDuration)}</strong> · Room Ref: <span className="font-mono">{roomId}</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <span className="font-bold text-foreground">Attending Physician:</span>
              <span className="text-primary font-semibold">{specialistName}</span>
            </div>

            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <span className="font-bold text-foreground">Patient:</span>
              <span>{patientName}</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="font-bold text-foreground block">
                Prescriptions Issued ({prescriptions.length}):
              </span>
              <ul className="space-y-1">
                {prescriptions.map((p, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2 rounded-lg bg-card border border-border">
                    <span className="font-mono font-medium">{p.name} ({p.dosage})</span>
                    <span className="text-muted-foreground">{p.frequency}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              asChild
              className="flex-1 h-11 text-xs font-semibold rounded-xl"
            >
              <Link href="/portal">
                <span>Return to Patient Portal</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="flex-1 h-11 text-xs font-semibold rounded-xl"
            >
              <Link href="/specialists">
                <span>Directory</span>
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col select-none">
      {/* 1. Top Call Header Strip */}
      <header className="h-14 sm:h-16 px-4 sm:px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link href="/portal" className="text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors">
            ← Portal
          </Link>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2 min-w-0">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm font-bold text-slate-100 truncate">
                {role === "doctor" ? `Patient: ${patientName}` : specialistName}
              </span>
              <span className="block text-[10px] font-mono text-slate-400 truncate">
                {role === "doctor" ? "Outpatient Telehealth Visit" : specialistTitle}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Timer & Encryption Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono font-semibold text-emerald-400">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatTimer(callDuration)}</span>
          </div>

          <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] font-mono text-slate-300">
            <Lock className="h-3 w-3 text-emerald-400" />
            <span>256-Bit Encrypted</span>
          </div>
        </div>

        {/* Right: Sidebar toggle & role */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden sm:inline-flex text-[10px] font-mono border-slate-700 text-slate-300">
            {role === "doctor" ? "Doctor Mode" : "Patient Mode"}
          </Badge>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
              isSidebarOpen
                ? "bg-slate-800 border-slate-700 text-primary"
                : "border-slate-800 text-slate-400 hover:bg-slate-900"
            }`}
            title="Toggle Clinical Sidebar"
          >
            <Activity className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* 2. Main Middle Workspace: Video Stage + Collapsible Clinical Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Video Stage Container */}
        <div className="flex-1 relative flex items-center justify-center p-3 sm:p-4 bg-slate-950 overflow-hidden">
          {/* Main Remote Feed (The Doctor if Patient, or Patient if Doctor) */}
          <div className="relative w-full h-full max-h-[82vh] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-2xl flex items-center justify-center">
            {isScreenSharing ? (
              /* Screen share view */
              <div className="w-full h-full p-6 flex flex-col justify-between bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono text-primary flex items-center gap-2">
                    <ScreenShare className="h-4 w-4" />
                    <span>Sharing Diagnostic Chart & 12-Lead Electrocardiogram</span>
                  </span>
                  <Badge variant="outline" className="border-slate-700 text-[10px] font-mono">
                    Live Display
                  </Badge>
                </div>

                {/* Animated ECG graph simulation */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="w-full max-w-lg h-32 rounded-2xl bg-slate-950 border border-slate-800 p-4 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                    <svg className="w-full h-16 text-emerald-400" viewBox="0 0 500 100" preserveAspectRatio="none">
                      <path
                        d="M0,50 L100,50 L115,20 L130,80 L145,10 L160,70 L175,50 L250,50 L265,20 L280,80 L295,10 L310,70 L325,50 L400,50 L415,20 L430,80 L445,10 L460,70 L475,50 L500,50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="animate-pulse"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Resting Heart Rate: 72 BPM · Normal Sinus Rhythm · PR Interval 160ms
                  </span>
                </div>
              </div>
            ) : (
              /* Doctor / Patient Camera Feed */
              <div className="relative w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    role === "doctor"
                      ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=80"
                      : specialistAvatar
                  }
                  alt="Remote Participant"
                  className="w-full h-full object-cover filter brightness-95"
                />

                {/* Video Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                {/* Bottom Left participant tag */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700/80 text-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-slate-100">
                    {role === "doctor" ? patientName : specialistName}
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">· 1080p HD</span>
                </div>

                {/* Live audio indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700/80 text-[10px] font-mono text-emerald-400">
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-emerald-400 rounded-full" style={{ height: `${audioLevel}%` }} />
                    <span className="w-0.5 bg-emerald-400 rounded-full" style={{ height: `${Math.min(100, audioLevel + 20)}%` }} />
                    <span className="w-0.5 bg-emerald-400 rounded-full" style={{ height: `${Math.max(10, audioLevel - 20)}%` }} />
                  </div>
                  <span>Audio Live</span>
                </div>
              </div>
            )}

            {/* Self Camera PiP (Picture-in-Picture) */}
            <div className="absolute bottom-4 right-4 w-32 sm:w-44 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-slate-700/90 shadow-xl bg-slate-800 z-10">
              {isVideoOn ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={
                    role === "doctor"
                      ? specialistAvatar
                      : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
                  }
                  alt="Your Self Camera"
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 space-y-1">
                  <VideoOff className="h-5 w-5 text-slate-500" />
                  <span className="text-[10px] font-mono">Camera Off</span>
                </div>
              )}

              <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-950/80 text-[9px] font-mono text-slate-300">
                You ({isMicOn ? "Mic On" : "Muted"})
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Clinical Sidebar */}
        {isSidebarOpen && (
          <aside className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full shrink-0 z-10 transition-all">
            {/* Sidebar Tab Switcher */}
            <div className="p-2 border-b border-slate-800 grid grid-cols-3 gap-1 bg-slate-950/40">
              <button
                type="button"
                onClick={() => setActiveSidebarTab("vitals")}
                className={`py-2 px-1 text-xs font-mono font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeSidebarTab === "vitals"
                    ? "bg-slate-800 text-primary shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Activity className="h-3.5 w-3.5" />
                <span>Vitals</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSidebarTab("prescription")}
                className={`py-2 px-1 text-xs font-mono font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeSidebarTab === "prescription"
                    ? "bg-slate-800 text-primary shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Pill className="h-3.5 w-3.5" />
                <span>Rx Pad</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSidebarTab("chat")}
                className={`py-2 px-1 text-xs font-mono font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeSidebarTab === "chat"
                    ? "bg-slate-800 text-primary shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Chat</span>
              </button>
            </div>

            {/* Sidebar Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* TAB 1: Real-time Patient Vitals & Clinical Notes */}
              {activeSidebarTab === "vitals" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      Live Telemetry & Vitals
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                        <span className="text-[10px] text-slate-400 block">Heart Rate</span>
                        <span className="text-base font-bold text-emerald-400">72 BPM</span>
                        <span className="text-[10px] text-slate-500 block">Normal Sinus</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                        <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
                        <span className="text-base font-bold text-slate-100">118 / 78</span>
                        <span className="text-[10px] text-slate-500 block">Optimal</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                        <span className="text-[10px] text-slate-400 block">Oxygen Sat (SpO2)</span>
                        <span className="text-base font-bold text-emerald-400">99%</span>
                        <span className="text-[10px] text-slate-500 block">Room Air</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                        <span className="text-[10px] text-slate-400 block">Temperature</span>
                        <span className="text-base font-bold text-slate-100">98.4 °F</span>
                        <span className="text-[10px] text-slate-500 block">Afebrile</span>
                      </div>
                    </div>
                  </div>

                  {/* Clinical SOAP Notes */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                        Clinical SOAP Documentation
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        ● Auto-saved
                      </span>
                    </div>

                    <Textarea
                      value={soapNotes}
                      onChange={(e) => setSoapNotes(e.target.value)}
                      placeholder="Doctor clinical notes..."
                      className="min-h-[140px] text-xs font-mono bg-slate-950 border-slate-800 text-slate-200 resize-none rounded-xl"
                      disabled={role === "patient"}
                    />
                    {role === "patient" && (
                      <p className="text-[10px] text-slate-500">
                        Doctor clinical documentation is automatically synchronized with your Patient Portal.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: Prescription Pad */}
              {activeSidebarTab === "prescription" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      Prescribed Medications
                    </span>
                    {role === "doctor" && !isAddingMed && (
                      <button
                        type="button"
                        onClick={() => setIsAddingMed(true)}
                        className="text-xs text-primary hover:underline font-mono cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" /> Add Rx
                      </button>
                    )}
                  </div>

                  {/* New prescription form for doctor */}
                  {isAddingMed && (
                    <form onSubmit={handleAddPrescription} className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2.5 text-xs">
                      <p className="font-bold text-slate-100">Issue Medication</p>
                      <Input
                        placeholder="Drug Name (e.g. Amoxicillin)"
                        value={newMedName}
                        onChange={(e) => setNewMedName(e.target.value)}
                        className="h-8 text-xs bg-slate-950 border-slate-700"
                        autoFocus
                      />
                      <Input
                        placeholder="Dosage (e.g. 500mg)"
                        value={newMedDosage}
                        onChange={(e) => setNewMedDosage(e.target.value)}
                        className="h-8 text-xs bg-slate-950 border-slate-700"
                      />
                      <div className="flex gap-2">
                        <Button type="submit" size="sm" className="h-7 text-xs flex-1">
                          Issue
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsAddingMed(false)}
                          className="h-7 text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* List of active prescriptions */}
                  <div className="space-y-2">
                    {prescriptions.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-100">{p.name}</span>
                          <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/40 text-emerald-400">
                            Verified Rx
                          </Badge>
                        </div>
                        <p className="text-slate-300 font-mono text-[11px]">{p.dosage} · {p.frequency}</p>
                        <p className="text-[10px] text-slate-400">Duration: {p.duration}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[10px] text-slate-400">
                    Prescriptions are electronically routed to the patient&apos;s preferred pharmacy under hospital NPI credentials.
                  </div>
                </div>
              )}

              {/* TAB 3: Encrypted In-Call Chat */}
              {activeSidebarTab === "chat" && (
                <div className="flex flex-col h-full space-y-3">
                  <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[420px] pr-1">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`p-2.5 rounded-xl text-xs space-y-0.5 ${
                          m.sender === "system"
                            ? "bg-slate-950 border border-slate-800 text-slate-400 text-[11px]"
                            : m.sender === (role === "doctor" ? "doctor" : "patient")
                            ? "bg-primary/20 border border-primary/30 text-slate-100 ml-4"
                            : "bg-slate-800 border border-slate-700 text-slate-200 mr-4"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>{m.senderName}</span>
                          <span>{m.time}</span>
                        </div>
                        <p className="leading-relaxed">{m.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chat input */}
                  <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-800">
                    <Input
                      placeholder="Type a clinical message..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="h-9 text-xs bg-slate-950 border-slate-800 rounded-xl"
                    />
                    <Button type="submit" size="icon" className="h-9 w-9 rounded-xl shrink-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* 3. Floating Bottom Controls Bar */}
      <footer className="h-20 px-4 bg-slate-900/95 border-t border-slate-800 flex items-center justify-center shrink-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mic Button */}
          <button
            type="button"
            onClick={() => setIsMicOn(!isMicOn)}
            className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              isMicOn
                ? "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700"
                : "bg-red-500/20 text-red-400 border border-red-500/40"
            }`}
            title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
          >
            {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>

          {/* Camera Button */}
          <button
            type="button"
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              isVideoOn
                ? "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700"
                : "bg-red-500/20 text-red-400 border border-red-500/40"
            }`}
            title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>

          {/* Screen Share Button */}
          <button
            type="button"
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              isScreenSharing
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                : "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700"
            }`}
            title="Share Screen / ECG Chart"
          >
            <ScreenShare className="h-5 w-5" />
          </button>

          {/* End Call Button */}
          <button
            type="button"
            onClick={handleEndCall}
            className="h-12 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-600/30"
            title="End Consultation"
          >
            <PhoneOff className="h-5 w-5" />
            <span className="text-xs hidden sm:inline">End Visit</span>
          </button>
        </div>
      </footer>
    </div>
  )
}
