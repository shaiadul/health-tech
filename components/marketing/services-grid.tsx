"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Brain,
  Baby,
  Bone,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { FINANCIAL_SERVICES } from "@/data/services"
import { Badge } from "@/components/ui/badge"

const DEPARTMENT_ICONS: Record<string, React.ElementType> = {
  srv_cardio_01: Heart,
  srv_neuro_02: Brain,
  srv_pediatrics_03: Baby,
  srv_ortho_04: Bone,
  srv_internal_05: Stethoscope,
  srv_exec_07: Sparkles,
}

export function ServicesGrid() {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)

  return (
    <section id="departments" className="py-20 md:py-28 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-border">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
              Specialized Healthcare
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Clinical departments & medical faculties.
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Our hospital center integrates comprehensive diagnostics, private outpatient consultation rooms, and subspecialty physicians for seamless clinical care.
          </p>
        </div>

        {/* Dynamic Department Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FINANCIAL_SERVICES.map((service, index) => {
            const Icon = DEPARTMENT_ICONS[service.id] || Stethoscope
            const isHovered = hoveredId === service.id

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`relative p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between gap-6 ${
                  isHovered
                    ? "border-primary bg-primary/5 shadow-md -translate-y-1"
                    : "border-border bg-background hover:border-primary/50"
                }`}
              >
                <div className="space-y-4">
                  {/* Department Icon + Index */}
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-sm bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-xl font-bold text-foreground hover:text-primary transition-colors block"
                    >
                      {service.title}
                    </Link>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>

                  {/* Clinical Benefits / Symptoms Treated */}
                  <div className="space-y-1.5 pt-2 border-t border-border/60">
                    {service.benefits.slice(0, 3).map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-xs text-foreground/85">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Strip with Duration & Action */}
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <div className="font-mono text-xs">
                    <span className="text-foreground font-bold block">{service.feeDisplay}</span>
                    <span className="text-[11px] text-muted-foreground">{service.durationMinutes}m consult</span>
                  </div>

                  <Link
                    href={`/book?service=${service.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-border bg-background hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <span>Book Slot</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Banner */}
        <div className="p-6 bg-muted/20 border border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>Need immediate same-day evaluation? Walk-in triage is open 24/7 on hospital campus.</span>
          </div>

          <Link
            href="/services"
            className="text-primary hover:underline font-semibold flex items-center gap-1 shrink-0"
          >
            <span>View All Department Protocols</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </section>
  )
}
