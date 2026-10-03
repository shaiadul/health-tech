"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { FINANCIAL_SERVICES } from "@/data/services"

export function ServicesGrid() {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)

  return (
    <section id="solutions" className="py-24 md:py-32 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-16 border-b border-border">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Services & Expertise
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Strategic solutions <br className="hidden sm:inline" />
              for every stage of capital.
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Every engagement starts with zero commissions and fiduciary accountability. Browse our core advisory verticals or schedule an introductory assessment.
          </p>
        </div>

        {/* Large Numbered Service List (Non-Card UI) */}
        <div className="divide-y divide-border">
          {FINANCIAL_SERVICES.map((service, index) => {
            const indexFormatted = String(index + 1).padStart(2, "0")
            const isHovered = hoveredId === service.id

            return (
              <div
                key={service.id}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative transition-colors duration-200"
              >
                {/* Active hover left teal indicator line */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-primary transition-opacity duration-200 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                />

                <div className="py-8 sm:py-10 px-2 sm:px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-muted/30 transition-all">
                  
                  {/* Left: Number + Title + Subtitle */}
                  <div className="flex items-start sm:items-baseline gap-6 sm:gap-10">
                    <span className="text-lg sm:text-xl font-mono text-muted-foreground group-hover:text-primary transition-colors">
                      {indexFormatted}
                    </span>

                    <div className="space-y-2 max-w-2xl">
                      <Link
                        href={`/services/${service.slug}`}
                        className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors inline-flex items-center gap-2"
                      >
                        <span>{service.title}</span>
                      </Link>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {service.shortDescription}
                      </p>
                    </div>
                  </div>

                  {/* Right: Meta Info + Direct Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 sm:gap-10 pl-12 sm:pl-0">
                    <div className="text-left sm:text-right font-mono text-xs text-muted-foreground space-y-1">
                      <span className="block text-foreground font-semibold">
                        {service.durationMinutes} min session
                      </span>
                      <span className="block text-[11px]">
                        {service.feeDisplay}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/book?service=${service.id}`}
                        className="text-xs font-semibold uppercase tracking-wider px-3.5 py-2 border border-border bg-background group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                      >
                        Book
                      </Link>

                      <Link
                        href={`/services/${service.slug}`}
                        className="h-9 w-9 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                        aria-label={`View details for ${service.title}`}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA bar */}
        <div className="pt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-muted-foreground">
            Looking for a customized institutional mandate or family office strategy?
          </p>
          <Link
            href="/services"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 group"
          >
            <span>Explore comprehensive curriculum and deliverables</span>
            <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  )
}
