"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Specialist } from "@/types/specialist"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  Clock,
  Video,
  Phone,
  Building2,
  ArrowRight,
  UserCheck,
  Eye,
  CheckCircle2,
} from "lucide-react"

interface SpecialistCardProps {
  specialist: Specialist
  onQuickView: (specialist: Specialist) => void
  onSelectSpecialty?: (specialty: string) => void
}

export function SpecialistCard({
  specialist,
  onQuickView,
  onSelectSpecialty,
}: SpecialistCardProps) {
  const isAvailableToday = specialist.nextAvailableSlot.toLowerCase().includes("today")

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 sm:p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 relative"
    >
      <div>
        {/* Top Header: Avatar + Meta */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={specialist.avatar}
              alt={specialist.name}
              className="h-18 w-18 sm:h-20 sm:w-20 rounded-2xl object-cover ring-1 ring-border group-hover:ring-primary/40 transition-all"
            />
            {isAvailableToday && (
              <span
                title="Available Today"
                className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-mono font-medium text-primary uppercase tracking-wider">
                {specialist.role}
              </span>
              {specialist.featured && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/10 text-primary font-semibold">
                  Featured
                </span>
              )}
            </div>

            <h3
              onClick={() => onQuickView(specialist)}
              className="text-lg font-bold text-foreground leading-snug truncate group-hover:text-primary transition-colors cursor-pointer"
            >
              {specialist.name}
            </h3>

            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {specialist.title}
            </p>

            {/* Rating & Exp */}
            <div className="flex items-center gap-3 mt-2 text-xs font-mono">
              <span className="inline-flex items-center gap-1 font-semibold text-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {specialist.rating}
                <span className="text-muted-foreground font-normal">
                  ({specialist.reviewCount})
                </span>
              </span>
              <span className="text-muted-foreground">
                {specialist.experienceYears}y exp
              </span>
            </div>
          </div>
        </div>

        {/* Bio snippet */}
        <p className="text-xs text-muted-foreground line-clamp-2 mt-4 leading-relaxed">
          {specialist.bio}
        </p>

        {/* Specialties Chips */}
        <div className="flex flex-wrap gap-1.5 mt-3.5">
          {specialist.specialties.map((spec, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelectSpecialty?.(spec)}
              className="text-[11px] font-medium px-2 py-0.5 rounded bg-muted/80 hover:bg-primary/15 hover:text-primary text-muted-foreground transition-colors cursor-pointer text-left"
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Card Footer: Consultation types + Next Slot + CTA */}
      <div className="mt-5 pt-4 border-t border-border space-y-4">
        {/* Availability & Formats strip */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground" title="Supported Consultation Formats">
            {specialist.consultationTypes.includes("video") && (
              <span className="p-1 rounded bg-muted/60 hover:text-primary transition-colors" title="Video Consultation">
                <Video className="h-3.5 w-3.5" />
              </span>
            )}
            {specialist.consultationTypes.includes("in_person") && (
              <span className="p-1 rounded bg-muted/60 hover:text-primary transition-colors" title="In-Person Clinic Visit">
                <Building2 className="h-3.5 w-3.5" />
              </span>
            )}
            {specialist.consultationTypes.includes("phone") && (
              <span className="p-1 rounded bg-muted/60 hover:text-primary transition-colors" title="Phone Consultation">
                <Phone className="h-3.5 w-3.5" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 font-mono text-[11px]">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className={isAvailableToday ? "text-emerald-600 font-semibold" : "text-muted-foreground"}>
              {specialist.nextAvailableSlot}
            </span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onQuickView(specialist)}
            className="text-xs h-9 gap-1.5 hover:bg-muted font-medium"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Profile</span>
          </Button>

          <Button
            asChild
            size="sm"
            className="text-xs h-9 gap-1.5 font-semibold group/btn"
          >
            <Link href={`/book?specialist=${specialist.id}`}>
              <span>Book</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.article>
  )
}
