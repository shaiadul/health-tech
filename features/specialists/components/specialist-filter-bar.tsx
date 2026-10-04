"use client"

import * as React from "react"
import { SpecialistFilter, ConsultationType } from "@/types/specialist"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Search,
  X,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Video,
  Building2,
  Phone,
  RotateCcw,
  Star,
  Calendar,
  CheckCircle2,
} from "lucide-react"

interface SpecialistFilterBarProps {
  filter: SpecialistFilter
  onFilterChange: (newFilter: SpecialistFilter) => void
  onResetFilters: () => void
  specialties: { name: string; count: number }[]
  totalSpecialists: number
  filteredCount: number
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
}

export function SpecialistFilterBar({
  filter,
  onFilterChange,
  onResetFilters,
  specialties,
  totalSpecialists,
  filteredCount,
  viewMode,
  onViewModeChange,
}: SpecialistFilterBarProps) {
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)

  // Keyboard shortcut listener (/ or Cmd+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key === "k")) && document.activeElement !== searchInputRef.current) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Count active filters (excluding default values)
  const activeFiltersCount = React.useMemo(() => {
    let count = 0
    if (filter.specialty && filter.specialty !== "all") count++
    if (filter.consultationType && filter.consultationType !== "all") count++
    if (filter.availability && filter.availability !== "all") count++
    if (filter.experienceMin && filter.experienceMin > 0) count++
    if (filter.minRating && filter.minRating > 0) count++
    if (filter.acceptingOnly) count++
    if (filter.search && filter.search.trim().length > 0) count++
    return count
  }, [filter])

  return (
    <div className="space-y-5">
      {/* 1. Primary Search Input Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={searchInputRef}
            type="text"
            value={filter.search || ""}
            onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
            placeholder="Search by physician name, specialty, clinical condition, or degree..."
            className="pl-10 pr-20 h-12 text-sm bg-card border-border rounded-xl shadow-xs focus-visible:ring-primary"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {filter.search ? (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filter, search: "" })}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            )}
          </div>
        </div>

        {/* Action Controls: Advanced Filter Sheet + View Mode Switcher */}
        <div className="flex items-center gap-2">
          {/* Deep Filter Drawer Trigger */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className={`h-12 px-4 rounded-xl gap-2 font-medium relative border-border bg-card hover:bg-muted/40 ${
                  activeFiltersCount > 0 ? "border-primary/50 text-primary" : ""
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Advanced Filters</span>
                <span className="sm:hidden">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-mono font-bold text-primary-foreground">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-full sm:max-w-md flex flex-col justify-between">
              <div className="space-y-6 overflow-y-auto pr-1">
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold flex items-center justify-between">
                    <span>Filter Specialists</span>
                    {activeFiltersCount > 0 && (
                      <span className="text-xs font-mono font-normal text-muted-foreground">
                        {activeFiltersCount} active
                      </span>
                    )}
                  </SheetTitle>
                  <SheetDescription className="text-xs text-muted-foreground">
                    Narrow down board-certified physicians by clinical criteria, rating, and schedule.
                  </SheetDescription>
                </SheetHeader>

                {/* Filter section: Minimum Rating */}
                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                    Patient Rating Threshold
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Any Rating", val: 0 },
                      { label: "4.9+ ★", val: 4.9 },
                      { label: "4.95+ ★", val: 4.95 },
                    ].map((item) => {
                      const isSelected = (filter.minRating || 0) === item.val
                      return (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() =>
                            onFilterChange({
                              ...filter,
                              minRating: isSelected ? undefined : item.val,
                            })
                          }
                          className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                              : "bg-muted/30 border-border text-foreground hover:bg-muted"
                          }`}
                        >
                          {item.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Filter section: Minimum Experience */}
                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                    Clinical Experience (Years)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "All Experience", val: 0 },
                      { label: "15+ Years", val: 15 },
                      { label: "18+ Years", val: 18 },
                    ].map((item) => {
                      const isSelected = (filter.experienceMin || 0) === item.val
                      return (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() =>
                            onFilterChange({
                              ...filter,
                              experienceMin: isSelected ? undefined : item.val,
                            })
                          }
                          className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                              : "bg-muted/30 border-border text-foreground hover:bg-muted"
                          }`}
                        >
                          {item.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Filter section: Consultation Type in sheet */}
                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                    Consultation Medium
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "all", label: "Any Consultation Medium", icon: null },
                      { id: "in_person", label: "In-Person Clinic Visit", icon: Building2 },
                      { id: "video", label: "Encrypted HD Video Telehealth", icon: Video },
                      { id: "phone", label: "Telephone Medical Consultation", icon: Phone },
                    ].map((type) => {
                      const Icon = type.icon
                      const isSelected = (filter.consultationType || "all") === type.id
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() =>
                            onFilterChange({
                              ...filter,
                              consultationType: type.id as any,
                            })
                          }
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-primary/10 border-primary text-primary font-semibold"
                              : "bg-muted/20 border-border text-foreground hover:bg-muted/40"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {Icon && <Icon className="h-4 w-4" />}
                            <span>{type.label}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Filter section: Availability */}
                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                    Appointment Slot Availability
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "all", label: "Any Time" },
                      { id: "today", label: "Today" },
                      { id: "tomorrow", label: "Tomorrow" },
                    ].map((slot) => {
                      const isSelected = (filter.availability || "all") === slot.id
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() =>
                            onFilterChange({
                              ...filter,
                              availability: slot.id as any,
                            })
                          }
                          className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                              : "bg-muted/30 border-border text-foreground hover:bg-muted"
                          }`}
                        >
                          {slot.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Accepting new patients toggle */}
                <div className="pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() =>
                      onFilterChange({
                        ...filter,
                        acceptingOnly: !filter.acceptingOnly,
                      })
                    }
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs transition-colors cursor-pointer ${
                      filter.acceptingOnly
                        ? "bg-primary/10 border-primary text-primary font-semibold"
                        : "bg-muted/20 border-border text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <span>Accepting New Patients Only</span>
                    <div
                      className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors ${
                        filter.acceptingOnly ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <div
                        className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                          filter.acceptingOnly ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </button>
                </div>
              </div>

              {/* Sheet Bottom Actions */}
              <div className="pt-6 border-t border-border flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={onResetFilters}
                  className="flex-1 gap-2 text-xs"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset All</span>
                </Button>
                <SheetClose asChild>
                  <Button className="flex-1 text-xs font-semibold">
                    Show {filteredCount} Doctors
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>

          {/* View Mode Toggle: Grid vs List */}
          <div className="hidden sm:flex items-center rounded-xl border border-border bg-card p-1 shadow-xs">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Editorial List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Specialty Quick Chip Carousel (Horizontal Scrollable) */}
      <div className="relative">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          {/* All Specialists Chip */}
          <button
            type="button"
            onClick={() => onFilterChange({ ...filter, specialty: "all" })}
            className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              !filter.specialty || filter.specialty === "all"
                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                : "bg-card hover:bg-muted/60 text-foreground border-border"
            }`}
          >
            <span>All Specialties</span>
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                !filter.specialty || filter.specialty === "all"
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {totalSpecialists}
            </span>
          </button>

          {/* Department Chips */}
          {specialties.map((spec) => {
            const isSelected = filter.specialty === spec.name
            return (
              <button
                key={spec.name}
                type="button"
                onClick={() =>
                  onFilterChange({
                    ...filter,
                    specialty: isSelected ? "all" : spec.name,
                  })
                }
                className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-card hover:bg-muted/60 text-foreground border-border"
                }`}
              >
                <span>{spec.name}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {spec.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Secondary Filter Bar: Quick Format Pills + Sort Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/60">
        {/* Quick Format & Availability Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Consultation Type Pills */}
          <div className="flex items-center bg-muted/40 p-1 rounded-xl border border-border/80 text-xs">
            <button
              type="button"
              onClick={() => onFilterChange({ ...filter, consultationType: "all" })}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                !filter.consultationType || filter.consultationType === "all"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Formats
            </button>

            <button
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filter,
                  consultationType:
                    filter.consultationType === "in_person" ? "all" : "in_person",
                })
              }
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filter.consultationType === "in_person"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2 className="h-3 w-3" />
              <span>In-Person</span>
            </button>

            <button
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filter,
                  consultationType:
                    filter.consultationType === "video" ? "all" : "video",
                })
              }
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filter.consultationType === "video"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Video className="h-3 w-3" />
              <span>Video</span>
            </button>

            <button
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filter,
                  consultationType:
                    filter.consultationType === "phone" ? "all" : "phone",
                })
              }
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filter.consultationType === "phone"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Phone className="h-3 w-3" />
              <span>Phone</span>
            </button>
          </div>

          {/* Quick Availability: Available Today */}
          <button
            type="button"
            onClick={() =>
              onFilterChange({
                ...filter,
                availability: filter.availability === "today" ? "all" : "today",
              })
            }
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              filter.availability === "today"
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-semibold"
                : "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Available Today</span>
          </button>
        </div>

        {/* Right side: Results count & Sort Dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs font-mono text-muted-foreground">
            Showing <strong className="text-foreground">{filteredCount}</strong> of {totalSpecialists} doctors
          </span>

          <div className="w-44">
            <Select
              value={filter.sortBy || "recommended"}
              onValueChange={(val: any) =>
                onFilterChange({ ...filter, sortBy: val })
              }
            >
              <SelectTrigger className="h-9 text-xs bg-card border-border rounded-lg">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
                <SelectItem value="name">Name (A–Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 4. Active Filters Dismissible Tags (when any filter is active) */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-muted-foreground font-mono">
            Active filters:
          </span>

          {filter.search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-primary/10 text-primary border border-primary/20">
              Query: &ldquo;{filter.search}&rdquo;
              <button
                type="button"
                onClick={() => onFilterChange({ ...filter, search: "" })}
                className="hover:text-foreground cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filter.specialty && filter.specialty !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-primary/10 text-primary border border-primary/20">
              Specialty: {filter.specialty}
              <button
                type="button"
                onClick={() => onFilterChange({ ...filter, specialty: "all" })}
                className="hover:text-foreground cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filter.consultationType && filter.consultationType !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-primary/10 text-primary border border-primary/20 capitalize">
              Format: {filter.consultationType.replace("_", " ")}
              <button
                type="button"
                onClick={() =>
                  onFilterChange({ ...filter, consultationType: "all" })
                }
                className="hover:text-foreground cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filter.availability && filter.availability !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 capitalize">
              Available: {filter.availability}
              <button
                type="button"
                onClick={() => onFilterChange({ ...filter, availability: "all" })}
                className="hover:text-foreground cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filter.minRating && filter.minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-amber-500/10 text-amber-600 border border-amber-500/30">
              ★ {filter.minRating}+
              <button
                type="button"
                onClick={() => onFilterChange({ ...filter, minRating: undefined })}
                className="hover:text-foreground cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filter.experienceMin && filter.experienceMin > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-muted text-foreground border border-border">
              Experience: {filter.experienceMin}+ yrs
              <button
                type="button"
                onClick={() =>
                  onFilterChange({ ...filter, experienceMin: undefined })
                }
                className="hover:text-foreground cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filter.acceptingOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-primary/10 text-primary border border-primary/20">
              Accepting New Patients
              <button
                type="button"
                onClick={() =>
                  onFilterChange({ ...filter, acceptingOnly: false })
                }
                className="hover:text-foreground cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors underline underline-offset-4 cursor-pointer ml-1"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
