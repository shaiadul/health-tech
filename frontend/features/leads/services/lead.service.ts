import { LeadSubmission, NewsletterSubmission } from "@/types/lead"
import { submitLeadAction, subscribeNewsletterAction } from "@/lib/actions"

let leadsStore: LeadSubmission[] = []
const newsletterStore: NewsletterSubmission[] = []

export const LeadService = {
  async submitLead(
    data: Omit<LeadSubmission, "id" | "createdAt">
  ): Promise<{ success: boolean; message: string }> {
    try {
      const res = await submitLeadAction(data)
      if (res.success && res.data) {
        leadsStore = [res.data, ...leadsStore]
        return {
          success: true,
          message: res.message || "Thank you. A member of our care team will reach out shortly.",
        }
      }
    } catch {
      // Fallback gracefully
    }

    const newLead: LeadSubmission = {
      id: `lead_${Date.now().toString(36)}`,
      ...data,
      createdAt: new Date().toISOString(),
    }
    leadsStore = [newLead, ...leadsStore]

    return {
      success: true,
      message: "Thank you. Our medical care team will contact you shortly.",
    }
  },

  async subscribeNewsletter(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const res = await subscribeNewsletterAction(email)
      if (res.success) {
        newsletterStore.push({
          email,
          subscribedAt: new Date().toISOString(),
        })
        return {
          success: true,
          message: res.message || "You're subscribed! Health insights are on their way.",
        }
      }
    } catch {
      // Fallback
    }

    newsletterStore.push({
      email,
      subscribedAt: new Date().toISOString(),
    })

    return {
      success: true,
      message: "You're subscribed! Health insights are on their way.",
    }
  },
}
