"use client"

import * as React from "react"
import {
  Activity,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
  Video,
  Building,
  HeartPulse,
  Star,
} from "lucide-react"

export function ClinicAnalyticsView() {
  const departmentStats = [
    { name: "Cardiology & Heart Health", count: 420, percent: 31, color: "bg-primary" },
    { name: "Neurology & Brain Health", count: 290, percent: 22, color: "bg-teal-500" },
    { name: "Pediatrics & Child Wellness", count: 260, percent: 20, color: "bg-cyan-500" },
    { name: "Orthopedics & Sports Medicine", count: 210, percent: 16, color: "bg-emerald-500" },
    { name: "Internal & General Medicine", count: 145, percent: 11, color: "bg-blue-500" },
  ]

  const weeklyTraffic = [
    { day: "Mon", count: 142, inClinic: 98, telehealth: 44 },
    { day: "Tue", count: 168, inClinic: 110, telehealth: 58 },
    { day: "Wed", count: 155, inClinic: 102, telehealth: 53 },
    { day: "Thu", count: 174, inClinic: 118, telehealth: 56 },
    { day: "Fri", count: 189, inClinic: 125, telehealth: 64 },
    { day: "Sat", count: 82, inClinic: 52, telehealth: 30 },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary font-semibold">
          <Activity className="h-4 w-4" />
          <span>Operational Intelligence & Clinical Metrics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
          Hospital & Clinic Performance Analytics
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Patient throughput volume, tele-consultation ratios, clinical wait times, and department occupancy.
        </p>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-muted/20 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-muted-foreground">Monthly Outpatients</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <span className="text-2xl font-bold font-mono text-foreground mt-2 block">1,325</span>
          <span className="text-[11px] text-emerald-600 flex items-center gap-1 mt-0.5">
            <TrendingUp className="h-3 w-3" />
            <span>+14.2% vs last month</span>
          </span>
        </div>

        <div className="p-4 bg-muted/20 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-muted-foreground">Avg Wait Time</span>
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <span className="text-2xl font-bold font-mono text-foreground mt-2 block">11.4 mins</span>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">Below 15m hospital benchmark</span>
        </div>

        <div className="p-4 bg-muted/20 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-muted-foreground">Telehealth Ratio</span>
            <Video className="h-4 w-4 text-primary" />
          </div>
          <span className="text-2xl font-bold font-mono text-foreground mt-2 block">36.8%</span>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">High patient retention</span>
        </div>

        <div className="p-4 bg-muted/20 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-muted-foreground">Clinical Satisfaction</span>
            <Star className="h-4 w-4 fill-primary text-primary" />
          </div>
          <span className="text-2xl font-bold font-mono text-foreground mt-2 block">99.4%</span>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">Based on 1,400+ surveys</span>
        </div>
      </div>

      {/* Main Visuals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Distribution Bar Chart Simulation */}
        <div className="lg:col-span-7 p-6 border border-border bg-background space-y-6">
          <div>
            <h3 className="font-bold text-base text-foreground">
              Patient Volume by Clinical Department
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Current month outpatient consultations across hospital faculties.
            </p>
          </div>

          <div className="space-y-4">
            {departmentStats.map((dept) => (
              <div key={dept.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{dept.name}</span>
                  <span className="font-mono text-muted-foreground">
                    {dept.count} visits ({dept.percent}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-muted/50 overflow-hidden">
                  <div
                    className={`h-full ${dept.color}`}
                    style={{ width: `${dept.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>Hospital Total: 1,325 Visits</span>
            <span className="text-primary font-semibold">Triage Accuracy: 99.1%</span>
          </div>
        </div>

        {/* Weekly Consultation Breakdown */}
        <div className="lg:col-span-5 p-6 border border-border bg-background space-y-6">
          <div>
            <h3 className="font-bold text-base text-foreground">
              Weekly Consultation Format Split
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              In-Clinic examination rooms vs encrypted Telehealth visits.
            </p>
          </div>

          <div className="space-y-3">
            {weeklyTraffic.map((day) => (
              <div key={day.day} className="flex items-center justify-between p-2.5 bg-muted/10 border border-border/60 text-xs">
                <span className="font-mono font-bold text-foreground w-12">{day.day}</span>

                <div className="flex-1 px-4">
                  <div className="flex h-2 w-full overflow-hidden bg-muted">
                    <div
                      className="bg-primary h-full"
                      style={{ width: `${(day.inClinic / day.count) * 100}%` }}
                      title={`In-Clinic: ${day.inClinic}`}
                    />
                    <div
                      className="bg-teal-400 h-full"
                      style={{ width: `${(day.telehealth / day.count) * 100}%` }}
                      title={`Telehealth: ${day.telehealth}`}
                    />
                  </div>
                </div>

                <div className="text-right font-mono text-[11px] shrink-0 text-muted-foreground">
                  <span className="text-foreground font-semibold">{day.count}</span> total
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 bg-primary" />
              <span>In-Clinic (66%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 bg-teal-400" />
              <span>Telehealth (34%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
