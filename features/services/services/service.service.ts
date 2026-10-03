import { FINANCIAL_SERVICES } from "@/data/services"
import { FinancialService } from "@/types/service"

export const ServiceService = {
  async getAll(): Promise<FinancialService[]> {
    return [...FINANCIAL_SERVICES]
  },

  async getBySlug(slug: string): Promise<FinancialService | null> {
    const service = FINANCIAL_SERVICES.find((s) => s.slug === slug)
    return service || null
  },

  async getById(id: string): Promise<FinancialService | null> {
    const service = FINANCIAL_SERVICES.find((s) => s.id === id)
    return service || null
  },

  async getFeatured(): Promise<FinancialService[]> {
    return FINANCIAL_SERVICES.filter((s) => s.popular)
  },
}
