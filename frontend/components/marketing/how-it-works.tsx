"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, CalendarCheck, FileHeart, Stethoscope, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "./section-heading"

const STEPS = [
  {
    icon: Building2,
    title: "Choose a department",
    description: "Tell us what you need help with, from heart health to a child's check-up.",
  },
  {
    icon: Stethoscope,
    title: "Pick your doctor",
    description: "Compare ratings, experience and next available times.",
  },
  {
    icon: CalendarCheck,
    title: "Book a time",
    description: "Visit in clinic or join by secure video. Confirmed instantly.",
  },
  {
    icon: FileHeart,
    title: "Get care & follow-up",
    description: "See your doctor, then get your plan and prescriptions in your portal.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-muted/40 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <SectionHeading
          align="center"
          eyebrow="How it works"
          title="Book in under 90 seconds"
          description="No paperwork, no phone queues, no payment today."
        />

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          {/* connector line (desktop) */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          />

          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="relative flex flex-col items-center text-center px-2"
            >
              <div className="relative">
                <span className="h-14 w-14 rounded-2xl bg-background border border-border shadow-sm text-primary flex items-center justify-center">
                  <s.icon className="h-6 w-6" />
                </span>
                <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-[16rem]">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button asChild size="lg" className="h-12 px-8 gap-2">
            <Link href="/book">
              Start booking <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
