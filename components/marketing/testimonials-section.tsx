"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, HeartPulse, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const TESTIMONIALS = [
  {
    quote: "The prompt cardiac evaluation and ECG assessment at MedPulse caught my arrhythmia early. Truly exceptional, unhurried physicians.",
    author: "David Thornton",
    title: "Cardiology Patient",
    highlight: "Early Diagnostic Intervention & Normal Rhythm Restored",
    service: "Cardiology & Heart Health",
    physician: "Dr. Sarah Ahmed, MD",
    rating: 5,
  },
  {
    quote: "Compassionate, thorough pediatric care. Dr. Rostova took the time to answer all our questions with genuine patience and empathy.",
    author: "Robert Sterling",
    title: "Pediatric Patient Parent",
    highlight: "Vaccination & Milestone Tracking Completed",
    service: "Pediatrics & Child Wellness",
    physician: "Dr. Elena Rostova, MD",
    rating: 5,
  },
  {
    quote: "The telehealth consultation was seamless. My diagnostic plan and e-prescription were at my pharmacy in 20 minutes without clinic wait times.",
    author: "Nadia Rahman",
    title: "Executive Health Patient",
    highlight: "Same-Day Diagnostic Plan & Prescription Delivery",
    service: "Internal Medicine",
    physician: "Dr. Michael Rahman, MD",
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [index, setIndex] = React.useState(0)

  const current = TESTIMONIALS[index]

  const next = () => setIndex((prev) => (prev + 1) % TESTIMONIALS.length)
  const prev = () => setIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)

  return (
    <section id="reviews" className="py-20 md:py-28 border-b border-border bg-gradient-to-b from-background via-muted/10 to-background overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary font-bold">
            <HeartPulse className="h-4 w-4" />
            <span>Verified Patient Reviews & Clinical Outcomes</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="h-9 w-9 rounded-none border-border hover:border-primary text-foreground"
              aria-label="Previous patient story"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="h-9 w-9 rounded-none border-border hover:border-primary text-foreground"
              aria-label="Next patient story"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Large Quotation */}
        <div className="py-10 md:py-16 min-h-[300px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="flex items-center gap-1.5 text-primary">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary" />
                ))}
                <span className="text-xs font-mono font-semibold ml-2 text-foreground">
                  5.0 Verified Medical Review
                </span>
              </div>

              <blockquote className="text-2xl sm:text-4xl md:text-5xl font-normal tracking-tight text-foreground leading-[1.18] font-serif">
                “{current.quote}”
              </blockquote>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pt-6 border-t border-border">
                <div>
                  <p className="text-base sm:text-lg font-bold text-foreground">
                    {current.author}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {current.title} · Attending: <span className="text-primary font-medium">{current.physician}</span>
                  </p>
                </div>

                <div className="font-mono text-xs text-muted-foreground sm:text-right">
                  <span className="block text-foreground font-semibold">Clinical Result:</span>
                  <span className="text-emerald-600 font-medium">{current.highlight}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots Selector */}
        <div className="flex justify-center gap-2 pt-4">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1.5 transition-all ${
                index === i ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
