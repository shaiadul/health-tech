"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth, UserRole, DEMO_USERS } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ShieldCheck,
  Stethoscope,
  Building2,
  ArrowRight,
  Activity,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Calendar,
} from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get("redirect") || "/dashboard"
  const { loginAs } = useAuth()

  // Primary staff roles for the hospital
  const [activeRole, setActiveRole] = React.useState<"organizer" | "doctor">("organizer")
  const [email, setEmail] = React.useState(DEMO_USERS.organizer.email)
  const [password, setPassword] = React.useState("HospitalAdminOps2026!")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = React.useState(false)

  // When tab changes, update demo credentials
  const handleRoleChange = (role: "organizer" | "doctor") => {
    setActiveRole(role)
    const demo = DEMO_USERS[role]
    setEmail(demo.email)
    if (role === "organizer") setPassword("HospitalAdminOps2026!")
    if (role === "doctor") setPassword("DoctorClinicalMD2026!")
  }

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsSubmitting(true)

    // Simulate clinical terminal authentication check
    await new Promise((r) => setTimeout(r, 450))

    loginAs(activeRole as UserRole, email)
    router.push(redirectPath)
  }

  const handleGoogleLogin = async () => {
    setIsGoogleSubmitting(true)
    await new Promise((r) => setTimeout(r, 550))
    loginAs(activeRole as UserRole, currentConfig.user.email)
    router.push(redirectPath)
  }

  const roleConfig = {
    organizer: {
      title: "Hospital Management (Admin)",
      subtitle: "Operations Command & Facility Administration",
      user: DEMO_USERS.organizer,
      icon: Building2,
      badge: "Hospital Administrator",
      badgeColor: "border-teal-500/30 text-teal-700 dark:text-teal-400 bg-teal-500/10",
      target: "/dashboard",
      staffId: "ORG-001",
      department: "Clinical Facility Operations · Suite 100",
      description: "Comprehensive hospital operations command, attending physician roster, outpatient triage queue, bed/room allocation & clinical analytics.",
      features: [
        "Hospital-wide outpatient appointment queue & admissions",
        "Physician roster duty scheduling & exam room allocation",
        "Clinical quality metrics, telemetry & department throughput",
        "Facility security, emergency contact rules & EHR preferences",
      ],
    },
    doctor: {
      title: "Attending Doctor (Physician)",
      subtitle: "Physician Workstation & Telehealth Consultations",
      user: DEMO_USERS.doctor,
      icon: Stethoscope,
      badge: "Board Certified Attending",
      badgeColor: "border-primary/30 text-primary bg-primary/10",
      target: "/dashboard",
      staffId: "MD-1029",
      department: "Cardiology & Heart Health · Room 402B",
      description: "Dedicated physician workstation: live daily patient queue, 1-click encrypted telehealth video room launch, clinical SOAP charting & Rx approvals.",
      features: [
        "Assigned daily patient queue & priority consultation callout",
        "1-Click Encrypted Telehealth Video Consultations launcher",
        "Electronic clinical SOAP notes documentation & EHR filing",
        "Electronic pharmacy refill approvals & vitals monitoring",
      ],
    },
  }

  const currentConfig = roleConfig[activeRole]
  const IconComponent = currentConfig.icon

  return (
    <Card className="w-full max-w-xl border border-border shadow-2xl bg-card rounded-3xl overflow-hidden">
      {/* Brand Header */}
      <CardHeader className="text-center pb-5 pt-7 sm:pt-8 bg-linear-to-b from-primary/10 via-primary/5 to-transparent border-b border-border">
        <Link href="/" className="inline-flex items-center gap-2.5 mx-auto mb-2 group">
          <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-xs">
            <Activity className="h-5 w-5" />
          </div>
          <div className="text-left">
            <span className="text-lg font-bold tracking-tight text-foreground block leading-tight">
              MedPulse
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-semibold block leading-tight">
              Hospital & Healthcare Clinic
            </span>
          </div>
        </Link>
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          Clinical Staff & Operations Terminal
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground max-w-md mx-auto">
          Role-based secure entry for Hospital Management and Attending Physicians.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 sm:p-7 space-y-6">
        {/* Role Selector Tabs */}
        <div>
          <label className="text-[11px] font-mono uppercase text-muted-foreground font-semibold block mb-2">
            Select Your Clinical Staff Role:
          </label>
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-muted/40 border border-border">
            {(
              [
                { id: "organizer", label: "Hospital Management", sub: "Admin Mode", icon: Building2 },
                { id: "doctor", label: "Attending Doctor", sub: "Physician Mode", icon: Stethoscope },
              ] as const
            ).map((tab) => {
              const TabIcon = tab.icon
              const isSelected = activeRole === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleRoleChange(tab.id)}
                  className={`py-3 px-3 rounded-xl text-left transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? "bg-card text-foreground shadow-sm border border-border scale-[1.01]"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                  }`}
                >
                  <div
                    className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <TabIcon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold leading-tight ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                      {tab.label}
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground leading-tight mt-0.5">
                      {tab.sub}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Role Profile Preview Card */}
        <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentConfig.user.avatar}
                alt={currentConfig.user.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary/30 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-foreground">
                    {currentConfig.user.name}
                  </h4>
                  <Badge variant="outline" className={`text-[10px] font-mono py-0 px-2 ${currentConfig.badgeColor}`}>
                    {currentConfig.staffId}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {currentConfig.user.roleTitle}
                </p>
                <p className="text-[11px] font-mono text-primary mt-0.5">
                  {currentConfig.department}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed border-t border-border/60 pt-2.5">
            {currentConfig.description}
          </p>

          {/* Quick permissions preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px] text-muted-foreground font-mono">
            {currentConfig.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-1.5 truncate">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Google Workspace SSO Option */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting || isGoogleSubmitting}
            onClick={handleGoogleLogin}
            className="w-full h-11 text-xs font-semibold rounded-xl gap-2.5 border-border bg-card hover:bg-muted/40 text-foreground shadow-2xs cursor-pointer"
          >
            {isGoogleSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Authenticating Google Workspace...</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google Workspace</span>
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="bg-card px-3 text-muted-foreground">
                Or enter clinical password
              </span>
            </div>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-muted-foreground font-semibold flex items-center justify-between">
              <span>Institutional Staff Email</span>
              <span className="text-[10px] text-primary font-normal">Pre-configured Demo</span>
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-xl bg-card border-border shadow-xs text-xs font-mono"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-muted-foreground font-semibold">
                Clinical Passcode
              </label>
              <span className="text-[11px] font-mono text-muted-foreground">Demo protected</span>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl bg-card border-border shadow-xs text-xs pr-10 font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Primary Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 text-xs font-semibold rounded-xl gap-2 shadow-md cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Authenticating Clinical Session…</span>
              </>
            ) : (
              <>
                <IconComponent className="h-4 w-4" />
                <span>Sign In to {currentConfig.title}</span>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </>
            )}
          </Button>

          {/* 1-Click Instant Demo Login shortcut */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleLogin()}
            className="w-full py-2.5 px-4 rounded-xl border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 text-xs font-mono text-primary transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>1-Click Instant Demo Sign In as {currentConfig.user.name.split(",")[0]}</span>
          </button>
        </form>

        {/* Patient Portal Link Notice */}
        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/80 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Are you a patient?</p>
              <p className="text-[11px] text-muted-foreground">
                Access appointments, telehealth video links & medical records.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="h-8 text-xs font-mono border-border shrink-0">
            <Link href="/portal">Patient Portal</Link>
          </Button>
        </div>
      </CardContent>

      <CardFooter className="py-4 border-t border-border bg-muted/10 text-center justify-center flex-col gap-1 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5 font-mono text-emerald-600">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>HIPAA & SOC-2 Type II Certified Healthcare Operations System</span>
        </div>
        <p className="text-[10px]">Restricted to authorized hospital management and licensed clinical personnel.</p>
      </CardFooter>
    </Card>
  )
}
