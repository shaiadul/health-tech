"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Baby,
  Bone,
  Brain,
  ClipboardCheck,
  Heart,
  PhoneCall,
  Sparkles,
  Stethoscope,
} from "lucide-react"
import { FINANCIAL_SERVICES } from "@/data/services"
import { SectionHeading } from "./section-heading"

const ICONS: Record<string, React.ElementType> = {
  cardiology: Heart,
  neurology: Brain,
  pediatrics: Baby,
  orthopedics: Bone,
  "internal-medicine": Stethoscope,
  dermatology: Sparkles,
  "executive-health-check": ClipboardCheck,
}

export function ServicesGrid() {
  return (
    <section id="departments" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Our departments"
            title="Find the right care for what you need"
            description="Pick a department to see doctors, fees and available times. Every visit starts with a clear plan."
          />
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all shrink-0"
          >
            View all departments <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FINANCIAL_SERVICES.map((s, i) => {
            const Icon = ICONS[s.slug] ?? Stethoscope
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
              >
                <Link
                  href={`/book?service=${s.id}`}
                  className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
                >
                  <span className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </span>

                  <h3 className="mt-5 text-lg font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {s.shortDescription}
                  </p>

                  <div className="mt-auto pt-6 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{s.feeDisplay}</span> · {s.durationMinutes} min
                    </span>
                    <span className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:translate-x-0.5">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}

          {/* Help tile */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl bg-primary text-primary-foreground p-6 flex flex-col justify-between gap-6"
          >
            <div>
              <PhoneCall className="h-6 w-6 opacity-90" />
              <h3 className="mt-5 text-lg font-bold">Not sure where to start?</h3>
              <p className="mt-1.5 text-sm text-primary-foreground/80 leading-relaxed">
                Our care team will match you with the right specialist, free of charge.
              </p>
            </div>
            <Link
              href="#get-guidance"
              className="inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
            >
              Talk to our care team <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
