"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  Building,
  UserCheck,
  PlusCircle,
  FileText,
  DollarSign,
  ArrowUpRight,
} from "lucide-react"

interface PatientAdmission {
  id: string
  mrn: string
  patientName: string
  age: number
  gender: string
  department: string
  doctor: string
  urgency: "Routine" | "Urgent" | "Stat"
  insurance: string
  fee: number
  paymentStatus: "Verified" | "Co-Pay Due" | "Self-Pay Settled"
  admissionTime: string
  room: string
}

const INITIAL_ADMISSIONS: PatientAdmission[] = [
  {
    id: "adm_01",
    mrn: "MRN-88219",
    patientName: "James Miller",
    age: 58,
    gender: "M",
    department: "Cardiology",
    doctor: "Dr. Sarah Ahmed, MD",
    urgency: "Urgent",
    insurance: "Blue Cross Blue Shield (PPO)",
    fee: 280,
    paymentStatus: "Verified",
    admissionTime: "09:30 AM",
    room: "Exam Room 402",
  },
  {
    id: "adm_02",
    mrn: "MRN-88220",
    patientName: "Nadia Chen",
    age: 34,
    gender: "F",
    department: "Neurology",
    doctor: "Dr. Marcus Vance, MD",
    urgency: "Routine",
    insurance: "Aetna Choice POS II",
    fee: 310,
    paymentStatus: "Verified",
    admissionTime: "11:15 AM",
    room: "Telehealth Room 2",
  },
  {
    id: "adm_03",
    mrn: "MRN-88221",
    patientName: "Liam Sterling",
    age: 4,
    gender: "M",
    department: "Pediatrics",
    doctor: "Dr. Elena Rostova, MD",
    urgency: "Routine",
    insurance: "UnitedHealthcare Choice",
    fee: 195,
    paymentStatus: "Co-Pay Due",
    admissionTime: "02:00 PM",
    room: "Pediatric Wing 102",
  },
  {
    id: "adm_04",
    mrn: "MRN-88222",
    patientName: "Elena Rodriguez",
    age: 42,
    gender: "F",
    department: "Orthopedics",
    doctor: "Dr. David Kim, MD",
    urgency: "Urgent",
    insurance: "Cigna Open Access",
    fee: 290,
    paymentStatus: "Verified",
    admissionTime: "03:45 PM",
    room: "Ortho Suite 210",
  },
  {
    id: "adm_05",
    mrn: "MRN-88223",
    patientName: "Robert Taylor",
    age: 67,
    gender: "M",
    department: "Internal Medicine",
    doctor: "Dr. Michael Rahman, MD",
    urgency: "Routine",
    insurance: "Medicare Part B",
    fee: 220,
    paymentStatus: "Verified",
    admissionTime: "04:30 PM",
    room: "Clinical Room 108",
  },
  {
    id: "adm_06",
    mrn: "MRN-88224",
    patientName: "Sophia Lin",
    age: 29,
    gender: "F",
    department: "Dermatology",
    doctor: "Dr. Priya Patel, MD",
    urgency: "Routine",
    insurance: "Self-Pay (Transparent Tier)",
    fee: 240,
    paymentStatus: "Self-Pay Settled",
    admissionTime: "05:15 PM",
    room: "Derm Center 304",
  },
]

export function PatientAdmissionsView() {
  const [admissions, setAdmissions] = React.useState<PatientAdmission[]>(INITIAL_ADMISSIONS)
  const [search, setSearch] = React.useState("")
  const [urgencyFilter, setUrgencyFilter] = React.useState<string>("all")

  const togglePayment = (id: string) => {
    setAdmissions((prev) =>
      prev.map((adm) => {
        if (adm.id !== id) return adm
        return {
          ...adm,
          paymentStatus: adm.paymentStatus === "Co-Pay Due" ? "Verified" : "Verified",
        }
      })
    )
  }

  const filtered = admissions.filter((adm) => {
    const matchesSearch =
      adm.patientName.toLowerCase().includes(search.toLowerCase()) ||
      adm.mrn.toLowerCase().includes(search.toLowerCase()) ||
      adm.department.toLowerCase().includes(search.toLowerCase()) ||
      adm.doctor.toLowerCase().includes(search.toLowerCase())

    if (urgencyFilter !== "all") {
      return matchesSearch && adm.urgency.toLowerCase() === urgencyFilter.toLowerCase()
    }
    return matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            <Activity className="h-4 w-4" />
            <span>Outpatient Inflow & Patient Intake</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
            Patient Admissions & Consultation Billing
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time outpatient reception, insurance pre-authorization, triage urgency, and consultation invoices.
          </p>
        </div>

        <Button asChild size="sm" className="h-9 text-xs bg-primary text-primary-foreground gap-1.5 self-start sm:self-auto">
          <Link href="/book">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Admit New Patient</span>
          </Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-muted/20 border border-border">
          <span className="text-[11px] font-mono uppercase text-muted-foreground block">Today&apos;s Admissions</span>
          <span className="text-2xl font-bold font-mono text-foreground mt-1 block">{admissions.length} Patients</span>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">100% Intake Form Verified</span>
        </div>

        <div className="p-4 bg-muted/20 border border-border">
          <span className="text-[11px] font-mono uppercase text-muted-foreground block">Urgent Clinical Triage</span>
          <span className="text-2xl font-bold font-mono text-amber-500 mt-1 block">
            {admissions.filter((a) => a.urgency === "Urgent").length} Cases
          </span>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">Priority Exam Rooms Assigned</span>
        </div>

        <div className="p-4 bg-muted/20 border border-border">
          <span className="text-[11px] font-mono uppercase text-muted-foreground block">Insured vs Self-Pay</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 mt-1 block">83.3% Insured</span>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">Pre-Auth In Good Standing</span>
        </div>

        <div className="p-4 bg-muted/20 border border-border">
          <span className="text-[11px] font-mono uppercase text-muted-foreground block">Total Expected Fee</span>
          <span className="text-2xl font-bold font-mono text-foreground mt-1 block">
            ${admissions.reduce((sum, a) => sum + a.fee, 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">Standard Clinic Revenue</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-muted/10 border border-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patient, MRN, doctor, insurance..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-xs bg-background"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs font-mono">
          <span className="text-muted-foreground mr-1 hidden sm:inline">Urgency:</span>
          {(["all", "routine", "urgent"] as const).map((urg) => (
            <button
              key={urg}
              type="button"
              onClick={() => setUrgencyFilter(urg)}
              className={`px-3 py-1.5 border text-xs capitalize transition-colors ${
                urgencyFilter === urg
                  ? "border-primary bg-primary text-primary-foreground font-semibold"
                  : "border-border bg-background hover:bg-muted text-muted-foreground"
              }`}
            >
              {urg}
            </button>
          ))}
        </div>
      </div>

      {/* Admissions Table */}
      <div className="border border-border overflow-x-auto bg-background">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/30 border-b border-border text-[11px] font-mono uppercase text-muted-foreground">
            <tr>
              <th className="p-3.5 pl-4">Patient & MRN</th>
              <th className="p-3.5">Department & Doctor</th>
              <th className="p-3.5">Urgency</th>
              <th className="p-3.5">Insurance / Billing</th>
              <th className="p-3.5">Time & Room</th>
              <th className="p-3.5 pr-4 text-right">Fee Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((adm) => (
              <tr key={adm.id} className="hover:bg-muted/10 transition-colors">
                <td className="p-3.5 pl-4">
                  <div className="font-bold text-foreground">{adm.patientName}</div>
                  <div className="text-[11px] font-mono text-muted-foreground">
                    {adm.mrn} · {adm.age}yo ({adm.gender})
                  </div>
                </td>

                <td className="p-3.5">
                  <div className="font-medium text-foreground">{adm.department}</div>
                  <div className="text-[11px] text-muted-foreground">{adm.doctor}</div>
                </td>

                <td className="p-3.5">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-mono uppercase ${
                      adm.urgency === "Urgent"
                        ? "border-amber-500/40 text-amber-600 bg-amber-500/10"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {adm.urgency}
                  </Badge>
                </td>

                <td className="p-3.5">
                  <div className="font-medium text-foreground">{adm.insurance}</div>
                  <div className="text-[11px] font-mono text-primary font-semibold">
                    ${adm.fee}.00 Standard
                  </div>
                </td>

                <td className="p-3.5">
                  <div className="font-mono text-foreground font-semibold">{adm.admissionTime}</div>
                  <div className="text-[11px] text-muted-foreground">{adm.room}</div>
                </td>

                <td className="p-3.5 pr-4 text-right">
                  <button
                    type="button"
                    onClick={() => togglePayment(adm.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded border transition-colors ${
                      adm.paymentStatus === "Verified" || adm.paymentStatus === "Self-Pay Settled"
                        ? "border-emerald-500/40 text-emerald-600 bg-emerald-500/10"
                        : "border-amber-500/40 text-amber-600 bg-amber-500/10 hover:bg-emerald-500/20"
                    }`}
                    title="Click to resolve co-pay"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{adm.paymentStatus}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
