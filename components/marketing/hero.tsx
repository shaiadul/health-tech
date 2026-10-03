"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Typography First Column */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Fiduciary Advisory Platform</span>
              <span className="text-border">/</span>
              <span className="text-foreground">Zero Product Commissions</span>
            </motion.div>

            {/* Oversized Responsive Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-bold tracking-tight text-foreground leading-[1.02]"
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
              Get personalized financial guidance, compare solutions, and book time with experts you can trust. No sales pitches, just clear strategy.
            </motion.p>

            {/* Actions */}
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
          </div>

          {/* Large Financial Visualization (Integrated Composition, Not Cards) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
            className="lg:col-span-5 w-full pt-4 lg:pt-0"
          >
            <div className="border border-border p-8 sm:p-10 bg-background relative space-y-8">
              {/* Header of the visualization */}
              <div className="flex items-baseline justify-between border-b border-border pb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Financial Overview
                </span>
                <span className="text-xs font-mono text-primary font-semibold">
                  Live Matrix · 2026
                </span>
              </div>

              {/* Progress metric */}
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Your financial progress
                  </span>
                  <span className="text-2xl font-bold font-mono text-foreground">
                    72%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-muted relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "72%" }}
                    transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                    className="h-full bg-primary"
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-1 text-muted-foreground">
                  <span className="text-primary font-semibold">+12.8% this month</span>
                  <span>Target: ৳5,000,000</span>
                </div>
              </div>

              {/* Integrated SVG Trend Line Graph */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pt-3">
                  <span>Portfolio trajectory</span>
                  <span className="text-foreground font-semibold">৳4,250,000</span>
                </div>

                <div className="h-32 w-full pt-2">
                  <svg
                    viewBox="0 0 320 100"
                    fill="none"
                    className="w-full h-full stroke-primary"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="editorialGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,80 Q40,65 80,70 T160,45 T240,30 T320,10 L320,100 L0,100 Z"
                      fill="url(#editorialGrad)"
                    />
                    <path
                      d="M0,80 Q40,65 80,70 T160,45 T240,30 T320,10"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                    {/* Data Points */}
                    <circle cx="160" cy="45" r="3.5" className="fill-background stroke-primary stroke-2" />
                    <circle cx="320" cy="10" r="4" className="fill-primary" />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-1 border-t border-border/60">
                  <span>Q1 2026</span>
                  <span>Q2 2026</span>
                  <span>Q3 2026</span>
                  <span className="text-primary font-medium">Q4 (Now)</span>
                </div>
              </div>

              {/* Subtle advisory note at bottom */}
              <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
                <span>Next review slot:</span>
                <Link
                  href="/book?specialist=sp_sarah_01"
                  className="font-mono text-primary font-semibold hover:underline"
                >
                  Today, 4:30 PM →
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
