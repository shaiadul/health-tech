"use client"

import * as React from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Specialist, SpecialistFilter } from "@/types/specialist"
import { SpecialistFilterBar } from "./specialist-filter-bar"
import { SpecialistCard } from "./specialist-card"
import { SpecialistEditorialRow } from "./specialist-editorial-row"
import { SpecialistDetailDialog } from "./specialist-detail-dialog"
import { Button } from "@/components/ui/button"
import {
  SearchX,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Award,
  Clock,
  CheckCircle,
} from "lucide-react"

interface SpecialistDirectoryProps {
  initialSpecialists: Specialist[]
  specialties: { name: string; count: number }[]
}

export function SpecialistDirectory({
  initialSpecialists,
  specialties,
}: SpecialistDirectoryProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize filter state from URL search params
  const [filter, setFilter] = React.useState<SpecialistFilter>(() => {
    const specialty = searchParams.get("specialty") || "all"
    const search = searchParams.get("search") || searchParams.get("q") || ""
    const consultationType = (searchParams.get("type") || "all") as any
    const availability = (searchParams.get("available") || "all") as any
    const minRating = searchParams.get("rating") ? Number(searchParams.get("rating")) : undefined
    const experienceMin = searchParams.get("exp") ? Number(searchParams.get("exp")) : undefined
    const sortBy = (searchParams.get("sort") || "recommended") as any

    return {
      specialty,
      search,
      consultationType,
      availability,
      minRating,
      experienceMin,
      sortBy,
    }
  })

  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [quickViewSpecialist, setQuickViewSpecialist] = React.useState<Specialist | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  // Sync state changes to URL search params seamlessly
  const syncUrlParams = React.useCallback(
    (newFilter: SpecialistFilter) => {
      const params = new URLSearchParams()
      if (newFilter.specialty && newFilter.specialty !== "all") {
        params.set("specialty", newFilter.specialty)
      }
      if (newFilter.search && newFilter.search.trim()) {
        params.set("search", newFilter.search.trim())
      }
      if (newFilter.consultationType && newFilter.consultationType !== "all") {
        params.set("type", newFilter.consultationType)
      }
      if (newFilter.availability && newFilter.availability !== "all") {
        params.set("available", newFilter.availability)
      }
      if (newFilter.minRating) {
        params.set("rating", String(newFilter.minRating))
      }
      if (newFilter.experienceMin) {
        params.set("exp", String(newFilter.experienceMin))
      }
      if (newFilter.sortBy && newFilter.sortBy !== "recommended") {
        params.set("sort", newFilter.sortBy)
      }

      const queryString = params.toString()
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname
      window.history.replaceState(null, "", newUrl)
    },
    [pathname]
  )

  const handleFilterChange = (newFilter: SpecialistFilter) => {
    setFilter(newFilter)
    syncUrlParams(newFilter)
  }

  const handleResetFilters = () => {
    const defaultFilter: SpecialistFilter = {
      specialty: "all",
      consultationType: "all",
      availability: "all",
      search: "",
      minRating: undefined,
      experienceMin: undefined,
      acceptingOnly: false,
      sortBy: "recommended",
    }
    setFilter(defaultFilter)
    syncUrlParams(defaultFilter)
  }

  const handleOpenQuickView = (specialist: Specialist) => {
    setQuickViewSpecialist(specialist)
    setIsDialogOpen(true)
  }

  const handleSelectSpecialtyFromCard = (specialtyName: string) => {
    const updated = { ...filter, specialty: specialtyName }
    setFilter(updated)
    syncUrlParams(updated)
  }

  // Filter and sort the specialists client-side for instantaneous, zero-latency feedback
  const filteredSpecialists = React.useMemo(() => {
    let result = [...initialSpecialists]

    // Specialty filter
    if (filter.specialty && filter.specialty !== "all") {
      result = result.filter((sp) =>
        sp.specialties.some(
          (s) => s.toLowerCase() === filter.specialty!.toLowerCase()
        )
      )
    }

    // Consultation type
    if (filter.consultationType && filter.consultationType !== "all") {
      result = result.filter((sp) =>
        sp.consultationTypes.includes(filter.consultationType as any)
      )
    }

    // Experience
    if (filter.experienceMin && filter.experienceMin > 0) {
      result = result.filter((sp) => sp.experienceYears >= filter.experienceMin!)
    }

    // Min Rating
    if (filter.minRating && filter.minRating > 0) {
      result = result.filter((sp) => sp.rating >= filter.minRating!)
    }

    // Availability
    if (filter.availability && filter.availability !== "all") {
      if (filter.availability === "today") {
        result = result.filter((sp) =>
          sp.nextAvailableSlot.toLowerCase().includes("today")
        )
      } else if (filter.availability === "tomorrow") {
        result = result.filter((sp) =>
          sp.nextAvailableSlot.toLowerCase().includes("tomorrow")
        )
      }
    }

    // Accepting new patients
    if (filter.acceptingOnly) {
      result = result.filter((sp) => sp.acceptingNewPatients !== false)
    }

    // Search query
    if (filter.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim()
      result = result.filter(
        (sp) =>
          sp.name.toLowerCase().includes(q) ||
          sp.title.toLowerCase().includes(q) ||
          sp.role.toLowerCase().includes(q) ||
          sp.bio.toLowerCase().includes(q) ||
          sp.education?.toLowerCase().includes(q) ||
          sp.hospitalAffiliation?.toLowerCase().includes(q) ||
          sp.specialties.some((s) => s.toLowerCase().includes(q)) ||
          sp.credentials.some((c) => c.toLowerCase().includes(q)) ||
          sp.languages?.some((l) => l.toLowerCase().includes(q))
      )
    }

    // Sort
    switch (filter.sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
        break
      case "experience":
        result.sort((a, b) => b.experienceYears - a.experienceYears)
        break
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "recommended":
      default:
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.rating - a.rating
        })
        break
    }

    return result
  }, [initialSpecialists, filter])

  return (
    <div className="space-y-10">
      {/* Interactive Filter Bar */}
      <SpecialistFilterBar
        filter={filter}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        specialties={specialties}
        totalSpecialists={initialSpecialists.length}
        filteredCount={filteredSpecialists.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Results View */}
      {filteredSpecialists.length > 0 ? (
        <div>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredSpecialists.map((specialist) => (
                  <SpecialistCard
                    key={specialist.id}
                    specialist={specialist}
                    onQuickView={handleOpenQuickView}
                    onSelectSpecialty={handleSelectSpecialtyFromCard}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="divide-y divide-border border-y border-border">
              <AnimatePresence mode="popLayout">
                {filteredSpecialists.map((specialist) => (
                  <SpecialistEditorialRow
                    key={specialist.id}
                    specialist={specialist}
                    onQuickView={handleOpenQuickView}
                    onSelectSpecialty={handleSelectSpecialtyFromCard}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      ) : (
        /* Empty State UX */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-dashed border-border bg-card/60 p-12 text-center max-w-xl mx-auto space-y-5"
        >
          <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <SearchX className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">
              No specialists match your criteria
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We couldn&apos;t find any doctors matching your specific filter combination. Try resetting filters or browsing by top clinical department.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={handleResetFilters}
              className="gap-2 text-xs font-semibold"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset All Filters</span>
            </Button>
          </div>

          {/* Quick suggestions */}
          <div className="pt-4 border-t border-border">
            <span className="text-xs font-mono text-muted-foreground block mb-2">
              Browse popular departments:
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {specialties.slice(0, 4).map((spec) => (
                <button
                  key={spec.name}
                  type="button"
                  onClick={() =>
                    handleFilterChange({
                      ...filter,
                      specialty: spec.name,
                      search: "",
                      consultationType: "all",
                      availability: "all",
                      minRating: undefined,
                      experienceMin: undefined,
                    })
                  }
                  className="text-xs px-2.5 py-1 rounded-md bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground cursor-pointer"
                >
                  {spec.name} ({spec.count})
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Clinical Trust Strip */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-border">
        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-muted/20 border border-border/60">
          <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">100% Board Certified</h4>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              All attending physicians hold active subspecialty board certifications and hospital privileges.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-muted/20 border border-border/60">
          <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Immediate Booking</h4>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Instant digital reservation directly syncs with hospital clinician calendars. Zero wait times.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-muted/20 border border-border/60">
          <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">HIPAA & Encrypted</h4>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Telehealth HD video and medical records are end-to-end encrypted under healthcare compliance standards.
            </p>
          </div>
        </div>
      </div>

      {/* Quick View Dialog */}
      <SpecialistDetailDialog
        specialist={quickViewSpecialist}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  )
}
