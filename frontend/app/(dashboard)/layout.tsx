"use client"

import * as React from "react"
import Link from "next/link"
import { useAuth, UserRole } from "@/lib/auth-context"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { QuickActionDialogs, QuickActionType } from "@/components/layout/quick-action-dialogs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Stethoscope,
  Lock,
  ArrowRight,
  Calendar,
  Activity,
  KeyRound,
  UserX,
} from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, role, user, loginAs, switchRole } = useAuth()
  const [activeQuickAction, setActiveQuickAction] = React.useState<QuickActionType>(null)

  // 1. Unauthenticated Gate: Restrict dashboard to Hospital Management and Doctors
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/20 text-foreground flex flex-col justify-center items-center p-4 sm:p-6">
        <Card className="w-full max-w-lg border border-border shadow-2xl bg-card rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-4 pt-8 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent border-b border-border">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-3">
              <Lock className="h-6 w-6" />
            </div>
            <Badge variant="outline" className="w-fit mx-auto text-[10px] font-mono border-amber-500/40 text-amber-600 bg-amber-500/10 mb-2">
              Staff Clearance Required
            </Badge>
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Clinical Operations Terminal
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground max-w-sm mx-auto">
              This dashboard is strictly reserved for authorized Hospital Management and licensed Attending Physicians.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <p className="text-xs text-muted-foreground text-center">
              Please sign in with your staff role or choose an instant 1-click clinical demo session below:
            </p>

            <div className="space-y-2.5">
              {/* Option A: Hospital Management */}
              <button
                type="button"
                onClick={() => loginAs("organizer")}
                className="w-full p-3.5 rounded-2xl border border-border bg-card hover:bg-muted/40 hover:border-primary/50 transition-all text-left flex items-center gap-3.5 group cursor-pointer"
              >
                <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-foreground">
                      Hospital Management (Admin)
                    </p>
                    <Badge variant="outline" className="text-[10px] font-mono border-teal-500/30 text-teal-600">
                      Dr. Marcus Vance
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">
                    Operations command, triage, doctor roster & admissions.
                  </p>
                </div>
              </button>

              {/* Option B: Attending Doctor */}
              <button
                type="button"
                onClick={() => loginAs("doctor")}
                className="w-full p-3.5 rounded-2xl border border-border bg-card hover:bg-muted/40 hover:border-primary/50 transition-all text-left flex items-center gap-3.5 group cursor-pointer"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-foreground">
                      Attending Doctor (Physician)
                    </p>
                    <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                      Dr. Sarah Ahmed
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">
                    Patient queue, telehealth video room & clinical SOAP notes.
                  </p>
                </div>
              </button>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button asChild className="w-full h-10 text-xs font-semibold rounded-xl gap-2 shadow-xs">
                <Link href="/login">
                  <span>Open Dedicated Sign In Terminal</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/portal"
                  className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
                >
                  Are you a patient? Go to Patient Care Portal →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 2. Patient Access Gate: If authenticated as Patient, block dashboard and provide patient portal link
  if (role === "patient") {
    return (
      <div className="min-h-screen bg-muted/20 text-foreground flex flex-col justify-center items-center p-4 sm:p-6">
        <Card className="w-full max-w-lg border border-border shadow-2xl bg-card rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-4 pt-8 bg-amber-500/10 border-b border-border">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/20 text-amber-600 mx-auto flex items-center justify-center mb-3">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <Badge variant="outline" className="w-fit mx-auto text-[10px] font-mono border-amber-500/40 text-amber-600 bg-amber-500/10 mb-2">
              Access Restricted · Clinical Staff Only
            </Badge>
            <CardTitle className="text-xl font-bold tracking-tight text-foreground">
              Hospital Operations Restricted
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground max-w-sm mx-auto">
              You are signed in as a Patient ({user?.name || "Alex Mercer"}). This dashboard is reserved exclusively for Hospital Management and Attending Doctors.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2 text-xs">
              <p className="font-semibold text-foreground">Looking for your patient care details?</p>
              <p className="text-muted-foreground leading-relaxed">
                As a registered patient, your upcoming consultations, telehealth video rooms, medical records, and prescription refills are located in the Patient Portal.
              </p>
            </div>

            <Button asChild className="w-full h-11 text-xs font-semibold rounded-xl gap-2 shadow-sm">
              <Link href="/portal">
                <Calendar className="h-4 w-4" />
                <span>Go to Patient Care Portal</span>
              </Link>
            </Button>

            <div className="pt-2 border-t border-border space-y-2 text-center">
              <p className="text-[11px] font-mono text-muted-foreground uppercase">
                Or Switch to a Clinical Staff Role:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchRole("organizer")}
                  className="h-9 text-xs font-mono border-border rounded-xl"
                >
                  <Building2 className="h-3.5 w-3.5 mr-1.5 text-teal-600" />
                  <span>Hospital Admin</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchRole("doctor")}
                  className="h-9 text-xs font-mono border-border rounded-xl"
                >
                  <Stethoscope className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  <span>Doctor Mode</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 3. Authorized Staff View (Hospital Management or Doctor)
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Header onOpenQuickAction={(action) => setActiveQuickAction(action)} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in-50 duration-200">
          {children}
        </main>
      </div>

      {/* Global Quick Action Modal */}
      <QuickActionDialogs
        action={activeQuickAction}
        onClose={() => setActiveQuickAction(null)}
      />
    </div>
  )
}
