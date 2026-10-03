"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"
import { SectionHeading } from "./section-heading"

const REVIEWS = [
  {
    quote:
      "The cardiac evaluation caught my arrhythmia early. The doctor explained everything clearly and I never felt rushed.",
    author: "David Thornton",
    role: "Cardiology patient",
    doctor: "Dr. Sarah Ahmed",
    initials: "DT",
  },
  {
    quote:
      "Dr. Rostova was so patient with our daughter. Booking took a minute and we were seen the same afternoon.",
    author: "Robert Sterling",
    role: "Parent, Pediatrics",
    doctor: "Dr. Elena Rostova",
    initials: "RS",
  },
  {
    quote:
      "The video consultation was seamless. My prescription reached my pharmacy within 20 minutes. No waiting room at all.",
    author: "Nadia Rahman",
    role: "Internal Medicine patient",
    doctor: "Dr. Michael Rahman",
    initials: "NR",
  },
]

export function TestimonialsSection() {
  return (
    <section id="reviews" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Patient stories"
            title="Trusted by thousands of patients"
            description="Real feedback from people who booked, visited and recovered with MedPulse."
          />
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4 shrink-0">
            <p className="text-4xl font-bold leading-none">4.9</p>
            <div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">from 25,000+ verified visits</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REVIEWS.map((r, i) => (
            <motion.figure
              key={r.author}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="relative flex flex-col rounded-2xl border border-border bg-card p-7 hover:shadow-lg hover:shadow-primary/5 transition-shadow"
            >
              <Quote className="h-8 w-8 text-primary/20" />
              <div className="mt-3 flex gap-0.5">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="mt-4 text-[15px] leading-relaxed text-foreground/90 flex-1">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-border flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                  {r.initials}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{r.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.role} · seen by {r.doctor}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
