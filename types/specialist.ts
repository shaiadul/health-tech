export type ConsultationType = "video" | "phone" | "in_person"

export interface Specialist {
  id: string
  name: string
  title: string
  role: string
  avatar: string
  experienceYears: number
  rating: number
  reviewCount: number
  specialties: string[]
  bio: string
  credentials: string[]
  consultationTypes: ConsultationType[]
  nextAvailableSlot: string // e.g. "Today, 4:30 PM"
  featured?: boolean
}

export interface SpecialistFilter {
  specialty?: string
  consultationType?: ConsultationType | "all"
  experienceMin?: number
  search?: string
}
