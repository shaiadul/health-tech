export interface LeadSubmission {
  id: string
  fullName: string
  email: string
  phone?: string
  serviceInterest?: string
  estimatedPortfolio?: string
  createdAt: string
}

export interface NewsletterSubmission {
  email: string
  subscribedAt: string
}

export interface Testimonial {
  id: string
  clientName: string
  clientRole: string
  clientCompany?: string
  avatar: string
  serviceName: string
  rating: number
  quote: string
  outcomeHighlight: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: "booking" | "security" | "pricing" | "specialists"
}
