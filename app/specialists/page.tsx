import * as React from "react"
import { SpecialistService } from "@/features/specialists/services/specialist.service"
import { SpecialistDirectory } from "@/features/specialists/components/specialist-directory"
import { MarketingNavbar } from "@/components/marketing/navbar"
import { MarketingFooter } from "@/components/marketing/footer"
import { PageContainer } from "@/components/layout/page-container"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, ShieldCheck, Clock, Award, Users } from "lucide-react"

export const metadata = {
  title: "Physicians & Medical Staff Directory | MedPulse Hospital",
  description:
    "Search and filter board-certified medical doctors across Cardiology, Pediatrics, Neurology, Orthopedics, Dermatology, and Internal Medicine. Book instant in-person or video consultations.",
}

function SpecialistsLoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Search Bar Skeleton */}
      <div className="h-12 w-full bg-muted/60 rounded-xl" />

      {/* Specialty Chips Skeleton */}
      <div className="flex gap-2 overflow-x-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-9 w-28 bg-muted/60 rounded-xl shrink-0" />
        ))}
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-72 bg-muted/40 rounded-2xl border border-border p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-muted rounded-2xl shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-5 w-36 bg-muted rounded" />
              </div>
            </div>
            <div className="h-12 w-full bg-muted/60 rounded" />
            <div className="h-9 w-full bg-muted/80 rounded-lg mt-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function SpecialistsPage() {
  const [specialists, specialties] = await Promise.all([
    SpecialistService.getAll(),
    SpecialistService.getSpecialtiesList(),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MarketingNavbar />

      <main className="flex-1">
        <PageContainer maxWidth="7xl" paddingY="default" className="space-y-12">
          {/* Header Section */}
          <div className="space-y-6 border-b border-border pb-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-primary/10 text-primary font-semibold">
                <Users className="h-3.5 w-3.5" />
                Medical Faculty Directory
              </span>
              <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
                · Updated for Spring 2026
              </span>
            </div>

            <div className="max-w-3xl space-y-3">
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
                Attending physicians. <br />
                <span className="text-primary italic font-serif font-normal">
                  Dedicated specialists
                </span>{" "}
                in every practice.
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Filter our medical directory by clinical subspecialty, consultation medium, patient rating, and real-time appointment availability.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs font-mono">
              <div className="p-3 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-1.5 text-foreground font-semibold text-sm">
                  <Award className="h-4 w-4 text-primary" />
                  <span>100% Board Certified</span>
                </div>
                <span className="text-muted-foreground mt-0.5 block">Faculty Doctors</span>
              </div>

              <div className="p-3 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-1.5 text-foreground font-semibold text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>4.94 / 5.0</span>
                </div>
                <span className="text-muted-foreground mt-0.5 block">Average Patient Rating</span>
              </div>

              <div className="p-3 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-1.5 text-foreground font-semibold text-sm">
                  <Clock className="h-4 w-4 text-emerald-500" />
                  <span>Same-Day Slots</span>
                </div>
                <span className="text-muted-foreground mt-0.5 block">Telehealth & Clinic</span>
              </div>

              <div className="p-3 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-1.5 text-foreground font-semibold text-sm">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Direct Scheduling</span>
                </div>
                <span className="text-muted-foreground mt-0.5 block">Zero Referral Required</span>
              </div>
            </div>
          </div>

          {/* Directory with Suspense for Next.js SearchParams */}
          <React.Suspense fallback={<SpecialistsLoadingSkeleton />}>
            <SpecialistDirectory
              initialSpecialists={specialists}
              specialties={specialties}
            />
          </React.Suspense>
        </PageContainer>
      </main>

      <MarketingFooter />
    </div>
  )
}
