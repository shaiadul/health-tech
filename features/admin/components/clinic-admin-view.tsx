"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Appointment, AppointmentStatus } from "@/types/appointment"
import { Specialist } from "@/types/specialist"
import {
  Activity,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ArrowUpRight,
  UserCheck,
  Building,
  Video,
  Phone,
  RefreshCw,
} from "lucide-react"

interface ClinicAdminViewProps {
  initialAppointments: Appointment[]
  doctors: Specialist[]
}

export function ClinicAdminView({
  initialAppointments,
  doctors,
}: ClinicAdminViewProps) {
  // Rich queue of clinic patient appointments
  const [appointments, setAppointments] = React.useState<Appointment[]>([
    ...initialAppointments,
    {
      id: "apt_admin_04",
      referenceNumber: "MED-2026-9120",
      serviceId: "srv_pediatrics_03",
      serviceTitle: "Pediatrics & Child Wellness",
      specialistId: "sp_elena_03",
      specialistName: "Dr. Elena Rostova, MD, FAAP",
      specialistTitle: "Lead Pediatrician",
      specialistAvatar: "https://images.unsplash.com/photo-1594824813587-f269a8b1f51e?w=300&auto=format&fit=crop&q=80",
      date: "2026-10-12",
      dateFormatted: "October 12, 2026",
      time: "02:15 PM",
      durationMinutes: 30,
      consultationType: "in_person",
      status: "confirmed",
      locationAddress: "Pediatric Wing, Suite 102",
      createdAt: "2026-10-02T10:15:00Z",
      customer: {
        firstName: "Liam",
        lastName: "Sterling",
        email: "sterling.family@gmail.com",
        phone: "+1 (555) 492-1102",
        contactMethod: "in_person",
        reason: "Child 4-year wellness vaccination & developmental milestone review",
      },
    },
    {
      id: "apt_admin_05",
      referenceNumber: "MED-2026-9311",
      serviceId: "srv_neuro_02",
      serviceTitle: "Neurology & Brain Health",
      specialistId: "sp_marcus_02",
      specialistName: "Dr. Marcus Vance, MD, PhD",
      specialistTitle: "Senior Neurologist",
      specialistAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80",
      date: "2026-10-12",
      dateFormatted: "October 12, 2026",
      time: "04:15 PM",
      durationMinutes: 45,
      consultationType: "video",
      status: "confirmed",
      meetingLink: "https://telehealth.medpulse.health/room/neuro-9311",
      createdAt: "2026-10-02T16:40:00Z",
      customer: {
        firstName: "Nadia",
        lastName: "Chen",
        email: "nadia.chen@techfirm.io",
        phone: "+1 (555) 883-2940",
        contactMethod: "video",
        reason: "Chronic migraine frequency increase & aura assessment",
      },
    },
    {
      id: "apt_admin_06",
      referenceNumber: "MED-2026-9402",
      serviceId: "srv_ortho_04",
      serviceTitle: "Orthopedics & Sports Medicine",
      specialistId: "sp_david_04",
      specialistName: "Dr. David Kim, MD, FAAOS",
      specialistTitle: "Chief Orthopedic Surgeon",
      specialistAvatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&auto=format&fit=crop&q=80",
      date: "2026-10-12",
      dateFormatted: "October 12, 2026",
      time: "05:00 PM",
      durationMinutes: 40,
      consultationType: "in_person",
      status: "confirmed",
      locationAddress: "Orthopedic Pavilion, Room 105",
      createdAt: "2026-10-03T08:10:00Z",
      customer: {
        firstName: "Marcus",
        lastName: "Thorne",
        email: "m.thorne@globalnet.com",
        phone: "+1 (555) 201-9944",
        contactMethod: "in_person",
        reason: "Shoulder rotator cuff post-MRI diagnosis & physical therapy roadmap",
      },
    },
  ])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedDepartment, setSelectedDepartment] = React.useState("all")
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all")

  // Status transitions: confirmed -> completed or cancelled
  const updateStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    )
  }

  // Filtered appointments queue
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.specialistName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDept =
      selectedDepartment === "all" || apt.serviceTitle.toLowerCase().includes(selectedDepartment.toLowerCase())

    const matchesStatus =
      selectedStatus === "all" || apt.status === selectedStatus

    return matchesSearch && matchesDept && matchesStatus
  })

  // Quick statistics
  const confirmedCount = appointments.filter((a) => a.status === "confirmed").length
  const completedCount = appointments.filter((a) => a.status === "completed").length
  const cancelledCount = appointments.filter((a) => a.status === "cancelled").length

  return (
    <div className="space-y-10 max-w-7xl mx-auto py-8">
      
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            <Activity className="h-4 w-4" />
            <span>MedPulse Hospital Operations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Clinic & Patient Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage outpatient appointment queues, patient triage status, attending doctors roster, and hospital room assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-none text-xs h-10 px-4 border-border font-mono"
          >
            <Link href="/portal">
              <span>View as Patient</span>
              <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="h-10 px-5 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold gap-1.5"
          >
            <Link href="/book">
              <span>+ New Patient Booking</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Hospital Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-border border-b border-border pb-8">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase text-muted-foreground">
            Active Patients Today
          </span>
          <p className="text-3xl sm:text-4xl font-bold font-mono text-foreground">
            {appointments.length}
          </p>
          <span className="text-xs font-mono text-primary font-semibold block">
            {confirmedCount} Pending / Confirmed
          </span>
        </div>

        <div className="space-y-1 pt-4 lg:pt-0 lg:pl-6">
          <span className="text-xs font-mono uppercase text-muted-foreground">
            Completed Visits
          </span>
          <p className="text-3xl sm:text-4xl font-bold font-mono text-foreground">
            {completedCount}
          </p>
          <span className="text-xs font-mono text-muted-foreground block">
            Prescriptions Dispatched
          </span>
        </div>

        <div className="space-y-1 pt-4 lg:pt-0 lg:pl-6">
          <span className="text-xs font-mono uppercase text-muted-foreground">
            Doctors on Duty
          </span>
          <p className="text-3xl sm:text-4xl font-bold font-mono text-foreground">
            {doctors.length}
          </p>
          <span className="text-xs font-mono text-primary font-semibold block">
            Across 6 Clinical Practices
          </span>
        </div>

        <div className="space-y-1 pt-4 lg:pt-0 lg:pl-6">
          <span className="text-xs font-mono uppercase text-muted-foreground">
            Clinic Room Occupancy
          </span>
          <p className="text-3xl sm:text-4xl font-bold font-mono text-foreground">
            85%
          </p>
          <span className="text-xs font-mono text-muted-foreground block">
            Average Wait: 4.2 mins
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name, ref ID, or doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-none border-border bg-background text-xs focus:border-primary"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-muted-foreground mr-1">Status:</span>
          {["all", "confirmed", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 border capitalize transition-colors ${
                selectedStatus === status
                  ? "border-primary bg-primary text-primary-foreground font-bold"
                  : "border-border hover:border-foreground text-muted-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Appointments Queue Table */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-border pb-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Patient Consultation Queue</span>
            <span className="text-xs font-mono font-semibold text-muted-foreground">
              ({filteredAppointments.length} matching)
            </span>
          </h2>
        </div>

        <div className="border border-border divide-y divide-border">
          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No appointments matching your current search or filter criteria.
            </div>
          ) : (
            filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-muted/20 transition-colors"
              >
                {/* Patient & Complaint Details */}
                <div className="space-y-1.5 max-w-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-foreground">
                      {apt.customer.firstName} {apt.customer.lastName}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 border border-border bg-muted/30">
                      {apt.referenceNumber}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 font-bold ${
                        apt.status === "confirmed"
                          ? "bg-primary text-primary-foreground"
                          : apt.status === "completed"
                          ? "bg-success/15 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">{apt.serviceTitle}</strong> · Attending: {apt.specialistName}
                  </p>

                  <p className="text-xs text-muted-foreground/90 font-mono">
                    Complaint: {apt.customer.reason}
                  </p>
                </div>

                {/* Schedule & Format */}
                <div className="font-mono text-xs space-y-1 lg:text-right">
                  <p className="font-bold text-foreground">
                    {apt.dateFormatted} · {apt.time}
                  </p>
                  <p className="text-muted-foreground flex items-center lg:justify-end gap-1.5">
                    {apt.consultationType === "video" ? (
                      <>
                        <Video className="h-3.5 w-3.5 text-primary" />
                        <span>Telehealth HD Video</span>
                      </>
                    ) : (
                      <>
                        <Building className="h-3.5 w-3.5 text-primary" />
                        <span>{apt.locationAddress || "In-Clinic Suite"}</span>
                      </>
                    )}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Tel: {apt.customer.phone} · {apt.customer.email}
                  </p>
                </div>

                {/* Admin Status Actions */}
                <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-border">
                  {apt.status === "confirmed" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(apt.id, "completed")}
                        className="rounded-none text-xs h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Mark Complete
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus(apt.id, "cancelled")}
                        className="rounded-none text-xs h-8 px-3 text-destructive border-border hover:border-destructive"
                      >
                        Cancel
                      </Button>
                    </>
                  )}

                  {apt.status === "completed" && (
                    <span className="text-xs font-mono text-success flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Record Archived</span>
                    </span>
                  )}

                  {apt.status === "cancelled" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(apt.id, "confirmed")}
                      className="rounded-none text-xs h-8 px-3 border-border font-mono"
                    >
                      Re-open
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Doctors on Duty Section */}
      <section className="space-y-4 pt-6 border-t border-border">
        <div className="flex items-baseline justify-between border-b border-border pb-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Attending Medical Doctors & Hospital Roster
          </h2>
          <span className="text-xs font-mono text-muted-foreground">
            {doctors.length} Physicians Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="p-4 border border-border space-y-2 bg-background">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{doctor.name}</h3>
                  <p className="text-xs text-primary font-medium">{doctor.title}</p>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1" title="Active on duty" />
              </div>

              <p className="text-xs font-mono text-muted-foreground">
                {doctor.specialties.join(" • ")}
              </p>

              <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-border/60">
                <span>{doctor.experienceYears} yrs clinical</span>
                <span className="text-foreground font-semibold">Next: {doctor.nextAvailableSlot}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
