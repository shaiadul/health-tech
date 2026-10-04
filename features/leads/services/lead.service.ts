import { LeadSubmission, NewsletterSubmission } from "@/types/lead"

let leadsStore: LeadSubmission[] = []
const newsletterStore: NewsletterSubmission[] = []

export const LeadService = {
  async submitLead(
    data: Omit<LeadSubmission, "id" | "createdAt">
  ): Promise<{ success: boolean; message: string }> {
    await new Promise((r) => setTimeout(r, 500))

    const newLead: LeadSubmission = {
      id: `lead_${Date.now().toString(36)}`,
      ...data,
      createdAt: new Date().toISOString(),
    }
    leadsStore = [newLead, ...leadsStore]

    return {
      success: true,
      message: "Thank you. A senior financial strategist will reach out within 2 hours.",
    }
  },

  async subscribeNewsletter(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    await new Promise((r) => setTimeout(r, 400))

    newsletterStore.push({
      email,
      subscribedAt: new Date().toISOString(),
    })

    return {
      success: true,
      message: "You're subscribed! Fiduciary insights are on their way.",
    }
  },
}
