"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Baby,
  Bone,
  Brain,
  Building,
  CalendarDays,
  Heart,
  PhoneCall,
  Sparkles,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEPARTMENTS = [
  {
    id: "srv_cardio_01",
    label: "Cardiology",
    hint: "Heart & blood pressure",
    icon: Heart,
  },
  {
    id: "srv_neuro_02",
    label: "Neurology",
    hint: "Migraine, nerves & brain",
    icon: Brain,
  },
  {
    id: "srv_pediatrics_03",
    label: "Pediatrics",
    hint: "Child care & vaccines",
    icon: Baby,
  },
  {
    id: "srv_ortho_04",
    label: "Orthopedics",
    hint: "Joints, bones & sports injury",
    icon: Bone,
  },
  {
    id: "srv_exec_07",
    label: "Health Check-up",
    hint: "Full-body screening",
    icon: Sparkles,
  },
];

export function MarketingHero() {
  const router = useRouter();
  const [service, setService] = React.useState(DEPARTMENTS[0].id);
  const [format, setFormat] = React.useState<"in_person" | "video">(
    "in_person",
  );
  const selectedDept =
    DEPARTMENTS.find((d) => d.id === service) ?? DEPARTMENTS[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/book?service=${service}&format=${format}`);
  };

  return (
    <section className="relative isolate flex flex-col min-h-svh lg:min-h-190">
      {/* ── Background photo ── */}
      <Image
        src="/images/hero-consultation.jpg"
        alt="Doctor consulting with a patient at MedPulse"
        fill
        priority
        className="object-cover object-center -z-20"
        sizes="100vw"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-slate-950/55 via-slate-950/40 to-slate-950/85" />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-slate-950/70 via-transparent to-transparent" />

      {/* ── Centre stage: headline + trust chips ── */}
      <div className="flex flex-1 flex-col items-center justify-center text-center px-4 sm:px-6 pt-24 pb-10">
        {/* Animated ping badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
          </span>
          <span className="text-xs font-semibold tracking-wide text-white/90 uppercase">
            Doctors Available Now
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.65,
            delay: 0.1,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="max-w-3xl text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.04]"
        >
          World-class care, <br className="hidden sm:block" />
          <span className="font-serif italic font-normal text-teal-300">
            at your convenience.
          </span>
        </motion.h1>

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="my-5 max-w-xl text-base sm:text-lg text-white/65 leading-relaxed"
        >
          Book board-certified specialists in under a minute — in clinic or by
          secure video, with no booking fee.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10 w-full px-4 sm:px-6 pb-8 lg:pb-12"
        >
          <motion.form
            onSubmit={handleSearch}
            className="mx-auto max-w-2xl rounded-xl bg-background text-foreground p-3 sm:p-4 shadow-2xl space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
              {/* Department Select */}
              <Select value={service} onValueChange={setService}>
                <SelectTrigger
                  aria-label="Select department"
                  className="h-auto min-h-14 rounded-lg border-border px-3 py-2 shadow-none hover:border-primary/60 focus:ring-2 focus:ring-primary/30 transition-colors [&>span]:line-clamp-none"
                >
                  <SelectValue>
                    <span className="flex items-center gap-3 text-left">
                      <span className="h-9 w-9 shrink-0 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                        <selectedDept.icon className="h-[18px] w-[18px]" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground leading-none">
                          Department
                        </span>
                        <span className="text-sm font-semibold leading-tight mt-1">
                          {selectedDept.label}
                        </span>
                      </span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={6}
                  className="rounded-xl border-border p-1.5 shadow-xl"
                >
                  {DEPARTMENTS.map((d) => (
                    <SelectItem
                      key={d.id}
                      value={d.id}
                      className="rounded-lg py-2.5 pl-2.5 pr-9 cursor-pointer focus:bg-primary/10 focus:text-foreground"
                    >
                      <span className="flex items-center gap-3">
                        <span className="h-9 w-9 shrink-0 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                          <d.icon className="h-[18px] w-[18px]" />
                        </span>
                        <span className="flex flex-col text-left">
                          <span className="text-sm font-semibold leading-tight">
                            {d.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {d.hint}
                          </span>
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Visit-type toggle */}
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

            {/* CTA button */}
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

          {/* Below-form contact line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-4 flex justify-center"
          >
            <Link
              href="tel:+18004325847"
              className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              Prefer to call?&nbsp;
              <span className="font-semibold">+1 (800) 432-5847</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
