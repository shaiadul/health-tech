"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ShieldCheck, Award } from "lucide-react"

export function TrustSection() {
  const metrics = [
    { value: "25,000+", label: "Outpatients Treated", detail: "Comprehensive clinical care" },
    { value: "99.4%", label: "Patient Satisfaction", detail: "Verified post-consult surveys" },
    { value: "40+", label: "Board-Certified MDs", detail: "Fellowship-trained specialists" },
    { value: "15+ Yrs", label: "Hospital Excellence", detail: "JCAHO & HIPAA accredited" },
  ]

  const accreditations = [
    "Joint Commission (JCAHO) Accredited",
    "American College of Cardiology Partner",
    "HIPAA Encrypted Patient Records",
    "Board of Medical Examiners Certified",
  ]

  return (
    <section className="py-20 md:py-24 border-b border-border bg-linear-to-b from-background via-muted/10 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Editorial Headline */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary font-bold">
              <Award className="h-4 w-4" />
              <span>Hospital Accreditation & Trust</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
              Hospital-grade care, <br />
              built around patient comfort.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every physician at MedPulse is board-certified and holds active clinical hospital privileges. We eliminate bureaucratic waiting rooms with prompt, unhurried, patient-centered appointments.
            </p>
          </div>

          {/* Metric Cards */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {metrics.map((metric, idx) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="p-5 border border-border bg-background hover:border-primary/50 transition-colors flex flex-col justify-between"
                >
                  <p className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-mono">
                    {metric.value}
                  </p>
                  <div className="pt-3">
                    <p className="text-xs uppercase font-mono font-semibold text-primary">
                      {metric.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {metric.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

        {/* Accreditation Badges Strip */}
        <div className="pt-8 border-t border-border/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          {accreditations.map((acc) => (
            <div key={acc} className="flex items-center gap-2 text-foreground font-medium">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>{acc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
