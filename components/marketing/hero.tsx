"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, ArrowUpRight, ShieldCheck, Clock, CheckCircle2, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Core Value Proposition & Headings */}
          <div className="lg:col-span-6 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Independent Fiduciary Advisory</span>
              <span className="text-border">/</span>
              <span className="text-foreground">Zero Product Commissions</span>
            </motion.div>

            {/* Oversized Responsive Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[4.75rem] font-bold tracking-tight text-foreground leading-[1.02]"
            >
              Make smarter <br />
              <span className="text-primary font-normal italic font-serif">financial decisions</span> <br />
              with confidence.
            </motion.h1>

            {/* Short Supporting Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16, ease: "easeOut" }}
              className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed font-normal"
            >
              Get personalized financial guidance, compare solutions, and book 1-on-1 time with vetted fiduciary specialists. No sales incentives, just clear strategic execution.
            </motion.p>

            {/* Direct Actions */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <Button
                asChild
                size="lg"
                className="h-13 px-8 text-sm font-semibold rounded-none bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-2"
              >
                <Link href="/book">
                  <span>Book a consultation</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                size="lg"
                className="h-13 px-6 text-sm font-medium rounded-none hover:bg-muted text-foreground transition-all group"
              >
                <Link href="/#solutions" className="flex items-center gap-1.5">
                  <span>Explore solutions</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </Button>
            </motion.div>

            {/* Micro Social Trust Metrics */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-mono text-muted-foreground border-t border-border">
              <span className="flex items-center gap-1.5 text-foreground font-semibold">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>100% Free Fiduciary Audit</span>
              </span>
              <span>•</span>
              <span>25K+ Clients Consulted</span>
              <span>•</span>
              <span className="text-primary font-semibold">4.9/5 Rating</span>
            </div>
          </div>

          {/* Right Column: Visual Composition with Picture & SVG Highlights */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-6 w-full relative"
          >
            {/* Visual Frame */}
            <div className="relative border border-border bg-background p-3 sm:p-4 space-y-4">
              
              {/* Image Container with Editorial Aspect Ratio */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                <Image
                  src="/images/hero-consultation.jpg"
                  alt="Finora Fiduciary Wealth Advisory Consultation"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-103"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Subtle Gradient Overlay at Bottom of Image for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Image Live Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-mono">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 border border-white/20">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Advisory Session · London / NYC</span>
                  </div>

                  <span className="hidden sm:inline bg-primary/90 text-primary-foreground px-2.5 py-1 font-semibold text-[11px]">
                    Fiduciary Standard
                  </span>
                </div>
              </div>

              {/* Interactive Consultative Strip Below Picture */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-primary font-bold block">
                      Lead Advisory Practice
                    </span>
                    <h3 className="text-base font-bold text-foreground">
                      Sarah Ahmed, CFA & Advisory Partners
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-mono">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    <span className="font-bold text-foreground">4.9 / 5.0</span>
                    <span className="text-muted-foreground">(384 Verified Reviews)</span>
                  </div>
                </div>

                {/* Measurable Outcome Highlight */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 bg-muted/40 border border-border">
                    <span className="text-[10px] text-muted-foreground block uppercase">
                      Average Client Alpha
                    </span>
                    <span className="text-sm font-bold text-foreground block mt-0.5">
                      +12.8% Net Yield
                    </span>
                  </div>

                  <div className="p-2.5 bg-muted/40 border border-border">
                    <span className="text-[10px] text-muted-foreground block uppercase">
                      Next Opening
                    </span>
                    <span className="text-sm font-bold text-primary block mt-0.5">
                      Today, 4:30 PM
                    </span>
                  </div>
                </div>

                {/* Direct 1-Click Action to Booking Flow */}
                <div className="pt-1">
                  <Button
                    asChild
                    className="w-full h-11 text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-2"
                  >
                    <Link href="/book?specialist=sp_sarah_01">
                      <span>Reserve Your 1-on-1 Consultation Slot</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

            </div>

            {/* Subtle SVG Decorative Accent Line Frame */}
            <svg
              className="absolute -top-3 -right-3 h-8 w-8 text-primary pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4h16v16" />
            </svg>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
