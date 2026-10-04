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
  languages?: string[]
  education?: string
  hospitalAffiliation?: string
  acceptingNewPatients?: boolean
  consultationFee?: string
}

export interface SpecialistFilter {
  specialty?: string
  consultationType?: ConsultationType | "all"
  experienceMin?: number
  minRating?: number
  availability?: "all" | "today" | "tomorrow"
  acceptingOnly?: boolean
  search?: string
  sortBy?: "recommended" | "rating" | "experience" | "name"
}
