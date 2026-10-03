export type ServiceCategory =
  | "wealth"
  | "tax"
  | "retirement"
  | "business"
  | "insurance"
  | "planning"

export interface ServiceProcessStep {
  step: string
  title: string
  description: string
}

export interface FinancialService {
  id: string
  slug: string
  title: string
  shortDescription: string
  fullDescription: string
  category: ServiceCategory
  durationMinutes: number
  feeDisplay: string
  iconName: string
  badge?: string
  benefits: string[]
  process: ServiceProcessStep[]
  requirements: string[]
  faqs: { question: string; answer: string }[]
  popular?: boolean
}
