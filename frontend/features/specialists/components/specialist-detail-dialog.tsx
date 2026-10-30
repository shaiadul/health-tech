"use client"

import * as React from "react"
import Link from "next/link"
import { Specialist } from "@/types/specialist"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Star,
  Clock,
  Video,
  Phone,
  Building2,
  GraduationCap,
  Award,
  Globe,
  CheckCircle2,
  CalendarCheck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react"

interface SpecialistDetailDialogProps {
  specialist: Specialist | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SpecialistDetailDialog({
  specialist,
  open,
  onOpenChange,
}: SpecialistDetailDialogProps) {
  if (!specialist) return null

  const isAvailableToday = specialist.nextAvailableSlot.toLowerCase().includes("today")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-border bg-card">
        {/* Header Hero Banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={specialist.avatar}
                alt={specialist.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-background shadow-md"
              />
              {isAvailableToday && (
                <span
                  title="Available Today"
                  className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background"
                >
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                </span>
              )}
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-[11px] font-mono border-primary/30 text-primary">
                  {specialist.role}
                </Badge>
                {specialist.acceptingNewPatients && (
                  <Badge variant="success" className="text-[11px]">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Accepting New Patients
                  </Badge>
                )}
              </div>

              <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">
                {specialist.name}
              </DialogTitle>

              <p className="text-sm font-medium text-muted-foreground">
                {specialist.title}
              </p>

              <div className="flex items-center gap-4 text-xs font-mono pt-1">
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {specialist.rating}
                  <span className="text-muted-foreground font-normal">
                    ({specialist.reviewCount} verified reviews)
                  </span>
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">
                  {specialist.experienceYears} Years Practice
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Next Available & Fee Pill */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-muted/40 border border-border">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-xs text-muted-foreground">Next Open Appointment</span>
                <span className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                  <span className={isAvailableToday ? "text-emerald-600 font-bold" : ""}>
                    {specialist.nextAvailableSlot}
                  </span>
                </span>
              </div>
            </div>

            {specialist.consultationFee && (
              <div className="text-right">
                <span className="block text-xs text-muted-foreground">Consultation Fee</span>
                <span className="font-mono font-bold text-sm text-foreground">
                  {specialist.consultationFee} <span className="text-xs font-normal text-muted-foreground">/ session</span>
                </span>
              </div>
            )}
          </div>

          {/* Clinical Specialties */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Clinical Specialties & Focus
            </h4>
            <div className="flex flex-wrap gap-2">
              {specialist.specialties.map((spec, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Doctor Bio */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Physician Biography & Practice Philosophy
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {specialist.bio}
            </p>
          </div>

          {/* Board Certifications & Education */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2 p-3.5 rounded-lg border border-border/80 bg-muted/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span>Education & Training</span>
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                {specialist.education || "Board Certified Specialist · Top Teaching Hospital Fellowship"}
              </p>
            </div>

            <div className="space-y-2 p-3.5 rounded-lg border border-border/80 bg-muted/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Hospital Affiliation</span>
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                {specialist.hospitalAffiliation || "MedPulse Main Clinical Campus"}
              </p>
            </div>
          </div>

          {/* Credentials list */}
          {specialist.credentials && specialist.credentials.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-primary" /> Board Certifications & Fellowships
              </h4>
              <ul className="space-y-1.5">
                {specialist.credentials.map((cred, i) => (
                  <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{cred}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages & Consultation Formats */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border">
            {specialist.languages && specialist.languages.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Globe className="h-3.5 w-3.5 text-primary" />
                <span>Languages:</span>
                <span className="font-medium text-foreground">
                  {specialist.languages.join(", ")}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Formats:</span>
              <div className="flex items-center gap-1.5">
                {specialist.consultationTypes.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-[11px] font-mono capitalize"
                  >
                    {type === "video" && <Video className="h-3 w-3 text-primary" />}
                    {type === "phone" && <Phone className="h-3 w-3 text-primary" />}
                    {type === "in_person" && <Building2 className="h-3 w-3 text-primary" />}
                    {type.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-muted/20 border-t border-border flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>

          <Button asChild size="default" className="gap-2 font-semibold">
            <Link href={`/book?specialist=${specialist.id}`}>
              <span>Book Appointment</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
