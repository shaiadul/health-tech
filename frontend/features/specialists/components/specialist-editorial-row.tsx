"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Specialist } from "@/types/specialist"
import { Button } from "@/components/ui/button"
import {
  Star,
  ArrowRight,
  Video,
  Phone,
  Building2,
  Eye,
  Clock,
} from "lucide-react"

interface SpecialistEditorialRowProps {
  specialist: Specialist
  onQuickView: (specialist: Specialist) => void
  onSelectSpecialty?: (specialty: string) => void
}

export function SpecialistEditorialRow({
  specialist,
  onQuickView,
  onSelectSpecialty,
}: SpecialistEditorialRowProps) {
  const isAvailableToday = specialist.nextAvailableSlot.toLowerCase().includes("today")

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="py-8 sm:py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-muted/20 px-3 sm:px-6 rounded-xl transition-colors group border-b border-border"
    >
      {/* Left: Avatar + Doctor Info */}
      <div className="flex items-start gap-4 sm:gap-6 max-w-3xl">
        <div className="relative shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={specialist.avatar}
            alt={specialist.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover ring-1 ring-border group-hover:ring-primary/40 transition-all"
          />
          {isAvailableToday && (
            <span
              title="Available Today"
              className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </span>
          )}
        </div>

        <div className="space-y-2 flex-1">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                onClick={() => onQuickView(specialist)}
                className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer"
              >
                {specialist.name}
              </h3>
              {specialist.featured && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                  Featured
                </span>
              )}
            </div>

            <p className="text-sm font-medium text-foreground/80 mt-0.5">
              {specialist.title} · <span className="text-primary font-semibold">{specialist.role}</span>
            </p>
          </div>

          {/* Specialties clickable chips */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {specialist.specialties.map((spec, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSelectSpecialty?.(spec)}
                className="text-xs font-mono font-medium text-primary hover:underline hover:text-primary/80 transition-colors cursor-pointer"
              >
                {spec}
                {i < specialist.specialties.length - 1 && (
                  <span className="text-muted-foreground/60 ml-1.5">•</span>
                )}
              </button>
            ))}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {specialist.bio}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-muted-foreground">
            {specialist.credentials.slice(0, 2).map((cred, idx) => (
              <span key={idx} className="border border-border/80 px-2 py-0.5 rounded bg-muted/30">
                {cred}
              </span>
            ))}
            {specialist.consultationFee && (
              <span className="font-semibold text-foreground">
                Fee: {specialist.consultationFee}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Metrics & Actions */}
      <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-5 font-mono text-xs shrink-0">
        <div className="flex items-center gap-6 sm:gap-8 lg:text-right">
          <div>
            <span className="block text-foreground font-semibold text-sm">
              {specialist.experienceYears} years
            </span>
            <span className="text-muted-foreground">clinical practice</span>
          </div>

          <div>
            <div className="flex items-center gap-1 text-foreground font-semibold text-sm lg:justify-end">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{specialist.rating}</span>
            </div>
            <span className="text-muted-foreground">({specialist.reviewCount} patients)</span>
          </div>
        </div>

        <div className="space-y-2 lg:text-right w-full sm:w-auto">
          <div className="flex items-center gap-1.5 lg:justify-end text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Next available:</span>
            <strong className={isAvailableToday ? "text-emerald-600 font-bold" : "text-primary"}>
              {specialist.nextAvailableSlot}
            </strong>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onQuickView(specialist)}
              className="text-xs h-9 gap-1 font-medium"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Details</span>
            </Button>

            <Link
              href={`/book?specialist=${specialist.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-5 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-all shadow-sm"
            >
              <span>Book</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
