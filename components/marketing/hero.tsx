"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Building,
  CalendarDays,
  HeartPulse,
  PhoneCall,
  ShieldCheck,
  Star,
  Stethoscope,
  Video,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const DEPARTMENTS = [
  { id: "srv_cardio_01", label: "Cardiology" },
  { id: "srv_neuro_02", label: "Neurology" },
  { id: "srv_pediatrics_03", label: "Pediatrics" },
  { id: "srv_ortho_04", label: "Orthopedics" },
  { id: "srv_exec_07", label: "Health Check-up" },
]

export function MarketingHero() {
  const router = useRouter()
  const [service, setService] = React.useState(DEPARTMENTS[0].id)
  const [format, setFormat] = React.useState<"in_person" | "video">("in_person")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/book?service=${service}&format=${format}`)
  }

  return (
    <section className="relative isolate overflow-hidden min-h-[640px] lg:min-h-[720px] flex items-center">
      {/* Full-bleed background */}
      <Image
        src="/images/hero-consultation.jpg"
        alt="Doctor consulting with a patient at MedPulse"
        fill
        priority
        className="object-cover -z-20"
        sizes="100vw"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-2xl space-y-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1.5 text-xs font-medium"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Doctors available today · Avg. wait 8 min</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]"
          >
            See the right doctor,{" "}
            <span className="text-teal-300 font-serif italic font-normal">today.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-base sm:text-lg text-white/80 max-w-xl leading-relaxed"
          >
            Book board-certified specialists in under a minute. Visit us in clinic or consult by secure video, with no booking fee.
          </motion.p>

          {/* Booking search bar */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="rounded-xl bg-background text-foreground p-3 sm:p-4 shadow-2xl space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
              <label className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 focus-within:border-primary transition-colors">
                <Stethoscope className="h-4 w-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="block text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
                    Department
                  </span>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold outline-none cursor-pointer"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <div className="grid grid-cols-2 rounded-lg border border-border p-1 text-xs font-semibold">
                {(
                  [
                    { id: "in_person", label: "In-Clinic", icon: Building },
                    { id: "video", label: "Video", icon: Video },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormat(opt.id)}
                    className={`flex items-center justify-center gap-1.5 px-4 rounded-md transition-colors ${
                      format === opt.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <opt.icon className="h-3.5 w-3.5" />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-12 text-sm font-semibold gap-2"
            >
              <CalendarDays className="h-4 w-4" />
              <span>Find Available Appointments</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/75"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-teal-300" /> HIPAA secure
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-teal-300 text-teal-300" /> 4.9 from 25,000+ patients
            </span>
            <Link
              href="tel:+18004325847"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <PhoneCall className="h-4 w-4 text-teal-300" /> +1 (800) 432-5847
            </Link>
          </motion.div>
        </div>

        {/* Floating glass chips (desktop) */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="hidden lg:block absolute right-8 bottom-16 w-72 space-y-3"
        >
          <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-teal-400/20 flex items-center justify-center">
                <HeartPulse className="h-5 w-5 text-teal-300" />
              </div>
              <div>
                <p className="text-sm font-bold">Dr. Sarah Ahmed, MD</p>
                <p className="text-xs text-white/70">Cardiology · Next slot 3:30 PM</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl p-4 text-white flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold font-mono">40+</p>
              <p className="text-xs text-white/70">Board-certified MDs</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold font-mono">99.4%</p>
              <p className="text-xs text-white/70">Satisfaction</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
