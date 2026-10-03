"use client"

import * as React from "react"
import Link from "next/link"
import { Specialist } from "@/types/specialist"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Star,
  UserCheck,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Stethoscope,
  PlusCircle,
} from "lucide-react"

interface PhysiciansRosterViewProps {
  doctors: Specialist[]
}

export function PhysiciansRosterView({ doctors }: PhysiciansRosterViewProps) {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<"all" | "on_duty" | "in_consultation">("all")
  
  // Local state for doctor duty statuses
  const [dutyStates, setDutyStates] = React.useState<Record<string, "On Duty" | "In Consultation" | "Rounds">>(
    doctors.reduce((acc, doc, idx) => {
      acc[doc.id] = idx === 0 ? "In Consultation" : idx === 1 || idx === 2 ? "On Duty" : "On Duty"
      return acc
    }, {} as Record<string, "On Duty" | "In Consultation" | "Rounds">)
  )

  const toggleDuty = (id: string) => {
    setDutyStates((prev) => {
      const current = prev[id]
      const next = current === "On Duty" ? "In Consultation" : current === "In Consultation" ? "Rounds" : "On Duty"
      return { ...prev, [id]: next }
    })
  }

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()))
    
    if (statusFilter === "on_duty") return matchesSearch && dutyStates[doc.id] === "On Duty"
    if (statusFilter === "in_consultation") return matchesSearch && dutyStates[doc.id] === "In Consultation"
    return matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            <Stethoscope className="h-4 w-4" />
            <span>Clinical Faculty & Attending Physicians</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
            Physician Staff & Clinic Roster
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Board-certified medical specialists, real-time duty status, room assignments, and scheduling load.
          </p>
        </div>

        <Button asChild size="sm" className="h-9 text-xs bg-primary text-primary-foreground gap-1.5 self-start sm:self-auto">
          <Link href="/book">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Schedule Patient with Doctor</span>
          </Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-muted/20 border border-border">
          <span className="text-[11px] font-mono uppercase text-muted-foreground block">Total Specialists</span>
          <span className="text-2xl font-bold font-mono text-foreground mt-1 block">{doctors.length}</span>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">Board Certified MDs</span>
        </div>

        <div className="p-4 bg-muted/20 border border-border">
          <span className="text-[11px] font-mono uppercase text-muted-foreground block">Currently On Duty</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 mt-1 block">
            {Object.values(dutyStates).filter((s) => s === "On Duty").length}
          </span>
          <span className="text-[11px] text-emerald-600/90 mt-0.5 block">Accepting Outpatients</span>
        </div>

        <div className="p-4 bg-muted/20 border border-border">
          <span className="text-[11px] font-mono uppercase text-muted-foreground block">In Consultation</span>
          <span className="text-2xl font-bold font-mono text-primary mt-1 block">
            {Object.values(dutyStates).filter((s) => s === "In Consultation").length}
          </span>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">Active Exam Rooms</span>
        </div>

        <div className="p-4 bg-muted/20 border border-border">
          <span className="text-[11px] font-mono uppercase text-muted-foreground block">Avg Clinical Rating</span>
          <span className="text-2xl font-bold font-mono text-foreground mt-1 block">4.94 / 5.0</span>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">1,800+ Patient Reviews</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-muted/10 border border-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search physician name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-xs bg-background"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs font-mono">
          <span className="text-muted-foreground mr-1 hidden sm:inline">Filter:</span>
          {(["all", "on_duty", "in_consultation"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setStatusFilter(mode)}
              className={`px-3 py-1.5 border text-xs capitalize transition-colors ${
                statusFilter === mode
                  ? "border-primary bg-primary text-primary-foreground font-semibold"
                  : "border-border bg-background hover:bg-muted text-muted-foreground"
              }`}
            >
              {mode.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Physicians Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDoctors.map((doc) => {
          const currentStatus = dutyStates[doc.id] || "On Duty"
          return (
            <div
              key={doc.id}
              className="p-5 border border-border bg-background hover:border-primary/50 transition-all flex flex-col justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden border border-border shrink-0 bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                      {doc.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-mono font-semibold text-foreground shrink-0">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                      <span>{doc.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-primary font-medium truncate">{doc.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {doc.experienceYears} Years Clinical Experience · {doc.reviewCount} Verified Reviews
                  </p>
                </div>
              </div>

              {/* Specialties and Credentials */}
              <div className="space-y-2 pt-2 border-t border-border/60 text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {doc.specialties.map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-[10px] font-normal py-0">
                      {spec}
                    </Badge>
                  ))}
                </div>

                <p className="text-[11px] text-muted-foreground line-clamp-2">
                  {doc.bio}
                </p>
              </div>

              {/* Status & Actions Bar */}
              <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => toggleDuty(doc.id)}
                  className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded border border-border hover:border-primary transition-colors text-left"
                  title="Click to toggle physician status"
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      currentStatus === "On Duty"
                        ? "bg-emerald-500 animate-pulse"
                        : currentStatus === "In Consultation"
                        ? "bg-primary"
                        : "bg-amber-500"
                    }`}
                  />
                  <span className="font-medium text-foreground">{currentStatus}</span>
                  <span className="text-[10px] text-muted-foreground">(toggle)</span>
                </button>

                <Button asChild variant="outline" size="sm" className="h-8 text-xs font-mono gap-1">
                  <Link href={`/book?specialist=${doc.id}`}>
                    <span>Book Slot</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
