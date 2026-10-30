import { SPECIALISTS } from "@/data/specialists"
import { Specialist, SpecialistFilter } from "@/types/specialist"

export const SpecialistService = {
  async getAll(filter?: SpecialistFilter): Promise<Specialist[]> {
    let result = [...SPECIALISTS]

    // Specialty filter
    if (filter?.specialty && filter.specialty !== "all") {
      result = result.filter((sp) =>
        sp.specialties.some(
          (s) => s.toLowerCase() === filter.specialty!.toLowerCase()
        )
      )
    }

    // Consultation type
    if (filter?.consultationType && filter.consultationType !== "all") {
      result = result.filter((sp) =>
        sp.consultationTypes.includes(filter.consultationType as any)
      )
    }

    // Minimum Experience
    if (filter?.experienceMin && filter.experienceMin > 0) {
      result = result.filter((sp) => sp.experienceYears >= filter.experienceMin!)
    }

    // Minimum Rating
    if (filter?.minRating && filter.minRating > 0) {
      result = result.filter((sp) => sp.rating >= filter.minRating!)
    }

    // Availability
    if (filter?.availability && filter.availability !== "all") {
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
    if (filter?.acceptingOnly) {
      result = result.filter((sp) => sp.acceptingNewPatients !== false)
    }

    // Free text search
    if (filter?.search) {
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

    // Sorting
    if (filter?.sortBy) {
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
    }

    return result
  },

  async getById(id: string): Promise<Specialist | null> {
    const sp = SPECIALISTS.find((s) => s.id === id)
    return sp || null
  },

  async getByServiceTitle(serviceTitle: string): Promise<Specialist[]> {
    return SPECIALISTS.filter((sp) => sp.specialties.includes(serviceTitle))
  },

  async getFeatured(): Promise<Specialist[]> {
    return SPECIALISTS.filter((s) => s.featured)
  },

  async getSpecialtiesList(): Promise<{ name: string; count: number }[]> {
    const counts: Record<string, number> = {}
    for (const sp of SPECIALISTS) {
      for (const spec of sp.specialties) {
        counts[spec] = (counts[spec] || 0) + 1
      }
    }
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  },
}
