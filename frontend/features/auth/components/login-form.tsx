"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth, UserRole, DEMO_USERS } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ShieldCheck,
  User,
  Stethoscope,
  Building2,
  Lock,
  ArrowRight,
  CheckCircle2,
  Activity,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const { loginAs } = useAuth()

  const [activeTab, setActiveTab] = React.useState<UserRole>("patient")
  const [email, setEmail] = React.useState(DEMO_USERS.patient.email)
  const [password, setPassword] = React.useState("MedPulsePatient2026!")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // When tab changes, update demo credentials
  const handleTabChange = (role: UserRole) => {
    setActiveTab(role)
    const demo = DEMO_USERS[role]
    setEmail(demo.email)
    if (role === "patient") setPassword("MedPulsePatient2026!")
    if (role === "doctor") setPassword("DoctorClinicalMD2026!")
    if (role === "organizer") setPassword("HospitalAdminOps2026!")
  }

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsSubmitting(true)

    // Simulate clinical auth check
    await new Promise((r) => setTimeout(r, 450))

    loginAs(activeTab, email)

    if (activeTab === "organizer") {
      router.push("/dashboard")
    } else if (activeTab === "doctor") {
      router.push("/consultation")
    } else {
      router.push("/portal")
    }
  }

  const roleMeta = {
    patient: {
      title: "Patient Care Portal",
      desc: "View upcoming appointments, enter video consult rooms, and check prescriptions.",
      icon: User,
      color: "text-emerald-500",
      target: "/portal",
    },
    doctor: {
      title: "Physician Workstation",
      desc: "Manage patient queues, launch telehealth video visits, and write clinical notes.",
      icon: Stethoscope,
      color: "text-primary",
      target: "/consultation",
    },
    organizer: {
      title: "Clinic Organizer & Admin",
      desc: "Hospital operations command, physician roster, triage queue & admissions.",
      icon: Building2,
      color: "text-amber-500",
      target: "/dashboard",
    },
  }

  const currentMeta = roleMeta[activeTab]

  return (
    <Card className="w-full max-w-lg border border-border shadow-2xl bg-card rounded-3xl overflow-hidden">
      {/* Brand Header */}
      <CardHeader className="text-center pb-4 pt-6 sm:pt-8 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent border-b border-border">
        <Link href="/" className="inline-flex items-center gap-2 mx-auto mb-2 group">
          <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-xs">
            <Activity className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            MedPulse Health
          </span>
        </Link>
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          Sign In to MedPulse
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground max-w-sm mx-auto">
          Choose your account type and sign in to access clinical services.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-muted/40 border border-border">
          {[
            { id: "patient", label: "Patient", icon: User },
            { id: "doctor", label: "Physician", icon: Stethoscope },
            { id: "organizer", label: "Organizer", icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon
            const isSelected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id as UserRole)}
                className={`py-2.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-card text-foreground shadow-sm border border-border font-bold scale-101"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? "text-primary" : ""}`} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Selected Role Info Card */}
        <div className="p-4 rounded-2xl bg-muted/20 border border-border/80 flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <currentMeta.icon className="h-5 w-5" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-sm text-foreground">
                {currentMeta.title}
              </h3>
              <Badge variant="outline" className="text-[10px] font-mono capitalize border-primary/30 text-primary">
                {activeTab}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {currentMeta.desc}
            </p>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-muted-foreground font-semibold">
              {activeTab === "patient" ? "Patient Email" : "Institutional Staff ID / Email"}
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
                Password
              </label>
              <span className="text-[11px] text-muted-foreground">Demo protected</span>
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
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Primary Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 text-xs font-semibold rounded-xl gap-2 shadow-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Authenticating Session…
              </>
            ) : (
              <>
                <span>Sign In to {currentMeta.title}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          {/* 1-Click Instant Demo Login shortcut */}
          <button
            type="button"
            onClick={() => handleLogin()}
            className="w-full py-2.5 px-4 rounded-xl border border-dashed border-border text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="h-3.5 w-3.5 text-primary" />
            <span>1-Click Instant Demo Login as {DEMO_USERS[activeTab].name}</span>
          </button>
        </form>
      </CardContent>

      <CardFooter className="py-4 border-t border-border bg-muted/10 text-center justify-center flex-col gap-1 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5 font-mono text-emerald-600">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>HIPAA & SOC-2 Type II Certified Healthcare Portal</span>
        </div>
        <p>Zero unencrypted personal health data stored on client devices.</p>
      </CardFooter>
    </Card>
  )
}
