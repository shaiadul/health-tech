"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Building2, Stethoscope, CalendarCheck, FileHeart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: Building2,
      title: "Select Clinical Department",
      description:
        "Choose your medical faculty—Cardiology, Pediatrics, Orthopedics, Neurology, Internal Medicine, or an Executive Health Check.",
    },
    {
      step: "02",
      icon: Stethoscope,
      title: "Choose Attending Physician",
      description:
        "Review board-certified medical doctors, subspecialty fellowship credentials, experience, and verified patient reviews.",
    },
    {
      step: "03",
      icon: CalendarCheck,
      title: "Pick In-Clinic or Telehealth Time",
      description:
        "Select your preferred slot for an in-person hospital exam room or an encrypted HD video telehealth consultation.",
    },
    {
      step: "04",
      icon: FileHeart,
      title: "Receive Treatment & E-Prescription",
      description:
        "Consult directly with your doctor, receive your diagnostic plan, and access certified digital prescriptions in your Patient Portal.",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 md:py-28 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
            Patient Care Journey
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            How healthcare booking works.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A frictionless, patient-first process designed to connect you with specialist medical care without tedious paperwork or clinic delays.
          </p>
        </div>

        {/* 4 Connected Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-6 border border-border bg-background hover:border-primary/50 transition-all flex flex-col justify-between gap-6 hover:shadow-xs"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl sm:text-4xl font-bold font-mono text-primary/80">
                      {item.step}
                    </span>
                    <div className="h-9 w-9 rounded-sm bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/80">
                    <h3 className="text-lg font-bold text-foreground tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-[11px] font-mono text-primary font-semibold flex items-center gap-1">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Strip */}
        <div className="p-6 bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="text-sm font-bold text-foreground block">
              Ready to schedule your medical consultation?
            </span>
            <span className="text-xs text-muted-foreground">
              Average booking completion takes under 90 seconds. No advance deposit required.
            </span>
          </div>

          <Button
            asChild
            className="h-10 px-6 text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-1.5 shrink-0"
          >
            <Link href="/book">
              <span>Start Booking Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  )
}
