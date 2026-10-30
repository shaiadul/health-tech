"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth, UserRole, DEMO_USERS } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  User,
  Stethoscope,
  Building2,
  Lock,
  ArrowRight,
  CheckCircle2,
  Activity,
  Video,
  FileText,
  Pill,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  Clock,
  HeartPulse,
} from "lucide-react";

export function PortalAuthGate() {
  const { login, loginAs, signup } = useAuth();
  const [activeTab, setActiveTab] = React.useState<"signin" | "register">(
    "signin",
  );

  // Sign in state
  const [email, setEmail] = React.useState(DEMO_USERS.patient.email);
  const [password, setPassword] = React.useState("MedPulse2026!");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Registration state
  const [regName, setRegName] = React.useState("");
  const [regEmail, setRegEmail] = React.useState("");
  const [regPhone, setRegPhone] = React.useState("");
  const [regRole, setRegRole] = React.useState<UserRole>("patient");
  const [isRegistering, setIsRegistering] = React.useState(false);

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await login(email, password);
    } catch {
      setErrorMessage("Unable to authenticate. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) return;
    setIsRegistering(true);

    try {
      await signup({
        name: regName,
        email: regEmail,
        role: regRole,
        phone: regPhone,
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const fillCredentials = (role: UserRole) => {
    const demo = DEMO_USERS[role];
    setEmail(demo.email);
    setPassword(
      role === "patient"
        ? "MedPulsePatient2026!"
        : role === "doctor"
          ? "DoctorClinicalMD2026!"
          : "HospitalAdminOps2026!",
    );
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* 1. Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Encrypted HIPAA-Compliant Healthcare Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          MedPulse Care & Staff Portal
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Sign in to access your upcoming specialist appointments, launch
          encrypted telehealth video visits, view vital telemetry, and manage
          prescriptions.
        </p>
      </div>

      {/* 3. Credentials & Registration Form */}
      <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-lg space-y-6">
        <div className="flex border-b border-border">
          <button
            type="button"
            onClick={() => setActiveTab("signin")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer px-4 ${
              activeTab === "signin"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In with Email & Password
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer px-4 ${
              activeTab === "register"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Create New Patient Account
          </button>
        </div>

        {activeTab === "signin" ? (
          <form onSubmit={handleCredentialLogin} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
                {errorMessage}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  Email Address
                </label>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                  <span>Quick Fill:</span>
                  <button
                    type="button"
                    onClick={() => fillCredentials("patient")}
                    className="text-primary hover:underline"
                  >
                    Patient
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => fillCredentials("doctor")}
                    className="text-primary hover:underline"
                  >
                    Doctor
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => fillCredentials("organizer")}
                    className="text-primary hover:underline"
                  >
                    Admin
                  </button>
                </div>
              </div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@medpulse.health"
                className="h-11 rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="h-11 rounded-xl text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 text-sm font-semibold rounded-xl gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  <span>Verifying Medical Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Sign In & Open Portal</span>
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                  placeholder="e.g. Jordan Hayes"
                  className="h-11 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  placeholder="jordan.hayes@gmail.com"
                  className="h-11 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  Mobile Phone (SMS Reminders)
                </label>
                <Input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="h-11 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  Account Type
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="flex h-11 w-full rounded-xl border border-input bg-card px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="patient">
                    Patient (Personal & Family Care)
                  </option>
                  <option value="doctor">Physician / Medical Specialist</option>
                  <option value="organizer">
                    Clinic Staff / Hospital Admin
                  </option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isRegistering}
              className="w-full h-11 text-sm font-semibold rounded-xl gap-2 shadow-sm"
            >
              {isRegistering ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  <span>Issuing Patient ID & Health Card...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Register & Enter Care Portal</span>
                </>
              )}
            </Button>
          </form>
        )}

        {/* Security badges */}
        <div className="pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono text-muted-foreground text-center">
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>HIPAA Compliant</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-primary" />
            <span>256-Bit SSL/TLS</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-emerald-500" />
            <span>HL7 / FHIR Synced</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <HeartPulse className="h-3.5 w-3.5 text-primary" />
            <span>Real-time Telemetry</span>
          </div>
        </div>
      </div>
    </div>
  );
}
