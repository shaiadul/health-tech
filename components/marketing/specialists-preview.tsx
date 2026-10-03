"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ArrowUpRight, Star, ShieldCheck, Stethoscope, Calendar } from "lucide-react"
import { SPECIALISTS } from "@/data/specialists"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function SpecialistsPreview() {
  const featured = SPECIALISTS.slice(0, 4)

  return (
    <section id="doctors" className="py-20 md:py-28 border-b border-border bg-gradient-to-b from-background via-muted/10 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-border">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
              Attending Physicians & Faculty
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Direct access to board-certified doctors.
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Our medical staff includes leaders in cardiology, neurology, pediatrics, and orthopedics trained at leading academic medical centers.
          </p>
        </div>

        {/* Visual Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((specialist, idx) => (
            <motion.div
              key={specialist.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group border border-border bg-background hover:border-primary/50 transition-all p-5 flex flex-col justify-between gap-5 hover:shadow-md"
            >
              <div className="space-y-4">
                {/* Doctor Avatar + Next Available Badge */}
                <div className="relative">
                  <div className="relative aspect-square w-full overflow-hidden bg-muted border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={specialist.avatar}
                      alt={specialist.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <Badge variant="secondary" className="text-[10px] font-mono bg-background/90 backdrop-blur-sm border border-border">
                      {specialist.experienceYears}y exp
                    </Badge>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                      {specialist.name}
                    </h3>
                  </div>

                  <p className="text-xs text-primary font-medium">
                    {specialist.title}
                  </p>

                  <div className="flex items-center gap-1 text-xs font-mono font-semibold text-foreground pt-1">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    <span>{specialist.rating}</span>
                    <span className="text-[11px] text-muted-foreground font-normal">
                      ({specialist.reviewCount} reviews)
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground line-clamp-2 pt-1">
                    {specialist.bio}
                  </p>
                </div>
              </div>

              {/* Booking Action */}
              <div className="pt-3 border-t border-border space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>Next Opening:</span>
                  <span className="text-emerald-600 font-semibold">{specialist.nextAvailableSlot}</span>
                </div>

                <Button
                  asChild
                  size="sm"
                  className="w-full text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-1.5"
                >
                  <Link href={`/book?specialist=${specialist.id}`}>
                    <span>Book Consultation</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Directory Link */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground border-t border-border">
          <span>Looking for sub-specialized oncology, pediatric cardiology, or surgical orthopedics?</span>
          <Link
            href="/specialists"
            className="text-primary hover:underline font-semibold inline-flex items-center gap-1 group"
          >
            <span>View Complete Medical Staff Directory (40+ MDs)</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  )
}
