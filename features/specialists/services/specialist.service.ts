import { SPECIALISTS } from "@/data/specialists"
import { Specialist, SpecialistFilter } from "@/types/specialist"

export const SpecialistService = {
  async getAll(filter?: SpecialistFilter): Promise<Specialist[]> {
    let result = [...SPECIALISTS]

    if (filter?.specialty && filter.specialty !== "all") {
      result = result.filter((sp) => sp.specialties.includes(filter.specialty!))
    }

    if (filter?.consultationType && filter.consultationType !== "all") {
      result = result.filter((sp) =>
        sp.consultationTypes.includes(filter.consultationType as any)
      )
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim()
      result = result.filter(
        (sp) =>
          sp.name.toLowerCase().includes(q) ||
          sp.title.toLowerCase().includes(q) ||
          sp.bio.toLowerCase().includes(q) ||
          sp.specialties.some((s) => s.toLowerCase().includes(q))
      )
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
}
