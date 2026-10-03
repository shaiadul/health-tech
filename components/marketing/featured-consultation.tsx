"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, CalendarClock, FileText, PhoneCall, Receipt, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "./section-heading"

const BENEFITS = [
  {
    icon: CalendarClock,
    title: "Same-day appointments",
    text: "Most patients are seen within 24 hours. Urgent needs are triaged first.",
  },
  {
    icon: Video,
    title: "Clinic or video, your choice",
    text: "Meet in person or consult securely from home. The care is the same.",
  },
  {
    icon: Receipt,
    title: "Clear, upfront pricing",
    text: "See the fee before you book. No hidden charges and nothing to pay today.",
  },
  {
    icon: FileText,
    title: "Records & prescriptions online",
    text: "Visit summaries, e-prescriptions and follow-ups in one patient portal.",
  },
]

export function FeaturedConsultation() {
  return (
    <section className="py-20 md:py-28 bg-muted/40 border-y border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="relative"
          >
            <div className="relative aspect-[5/4] overflow-hidden rounded-3xl shadow-2xl shadow-primary/10">
              <Image
                src="/images/hero-consultation.jpg"
                alt="A MedPulse doctor speaking with a patient"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="absolute -bottom-6 right-4 sm:-right-4 rounded-2xl bg-background border border-border shadow-xl p-4 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none">8 min</p>
                <p className="text-xs text-muted-foreground mt-1">average wait today</p>
              </div>
            </div>
          </motion.div>

          {/* Copy */}
          <div className="space-y-8">
            <SectionHeading
              eyebrow="Why MedPulse"
              title="Healthcare that respects your time"
              description="We removed the waiting rooms, the paperwork and the surprises, so you can focus on getting better."
            />

            <ul className="space-y-5">
              {BENEFITS.map((b, i) => (
                <motion.li
                  key={b.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  className="flex gap-4"
                >
                  <span className="h-11 w-11 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <b.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold">{b.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{b.text}</p>
                  </div>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button asChild size="lg" className="h-12 px-7 gap-2">
                <Link href="/book">
                  Book an appointment <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-7 gap-2">
                <Link href="tel:+18004325847">
                  <PhoneCall className="h-4 w-4 text-primary" /> +1 (800) 432-5847
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
