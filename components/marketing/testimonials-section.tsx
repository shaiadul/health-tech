"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const TESTIMONIALS = [
  {
    quote: "The prompt cardiac evaluation and ECG assessment at MedPulse caught my arrhythmia early. Truly exceptional physicians.",
    author: "David Thornton",
    title: "Cardiology Outpatient",
    highlight: "Early Diagnostic Intervention",
    service: "Cardiology & Heart Health",
  },
  {
    quote: "Compassionate, thorough pediatric care. Dr. Rostova took the time to answer all our questions with genuine patience.",
    author: "Robert Sterling",
    title: "Pediatric Patient Parent",
    highlight: "Comprehensive Wellness Verified",
    service: "Pediatrics & Child Wellness",
  },
  {
    quote: "The telehealth consultation was seamless. My diagnostic plan and e-prescription were at my pharmacy in 20 minutes.",
    author: "Nadia Rahman",
    title: "Executive Health Patient",
    highlight: "Same-Day Diagnostic Plan",
    service: "Internal Medicine",
  },
]

export function TestimonialsSection() {
  const [index, setIndex] = React.useState(0)

  const current = TESTIMONIALS[index]

  const next = () => setIndex((prev) => (prev + 1) % TESTIMONIALS.length)
  const prev = () => setIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)

  return (
    <section className="py-24 md:py-36 border-b border-border bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        
        <div className="flex items-center justify-between border-b border-border pb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            Client Perspectives · Fictional Demo Case Studies
          </span>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="h-8 w-8 rounded-none border-border hover:border-primary text-foreground"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="h-8 w-8 rounded-none border-border hover:border-primary text-foreground"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Large Quotation Typography (No Cards) */}
        <div className="py-16 md:py-24 min-h-[320px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-12"
            >
              <blockquote className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-foreground leading-[1.15] font-serif">
                “{current.quote}”
              </blockquote>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pt-8 border-t border-border">
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {current.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {current.title} · <span className="text-primary">{current.service}</span>
                  </p>
                </div>

                <div className="font-mono text-xs text-muted-foreground sm:text-right">
                  <span className="block text-foreground font-semibold">Outcome:</span>
                  <span className="text-primary font-medium">{current.highlight}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}
