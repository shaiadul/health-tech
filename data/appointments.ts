import { Appointment, DayAvailability, TimeSlot } from "@/types/appointment"

export const INITIAL_USER_APPOINTMENTS: Appointment[] = [
  {
    id: "apt_up_01",
    referenceNumber: "FIN-2026-9041",
    serviceId: "srv_invest_01",
    serviceTitle: "Investment Planning",
    specialistId: "sp_sarah_01",
    specialistName: "Sarah Ahmed, CFA",
    specialistTitle: "Senior Financial Advisor & Wealth Lead",
    specialistAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    date: "2026-10-12",
    dateFormatted: "October 12, 2026",
    time: "04:30 PM",
    durationMinutes: 45,
    consultationType: "video",
    status: "confirmed",
    meetingLink: "https://meet.finora.io/room/fin-2026-9041?token=secure_984",
    createdAt: "2026-10-01T14:20:00Z",
    customer: {
      firstName: "Alex",
      lastName: "Mercer",
      email: "alex.mercer@gmail.com",
      phone: "+1 (555) 389-9921",
      contactMethod: "video",
      reason: "Quarterly rebalancing and diversification into dividend treasury instruments",
      additionalNotes: "Have uploaded past 2 years brokerage summaries.",
    },
  },
  {
    id: "apt_past_02",
    referenceNumber: "FIN-2026-8104",
    serviceId: "srv_health_07",
    serviceTitle: "Financial Health Diagnostic",
    specialistId: "sp_david_04",
    specialistName: "David Kim, CFP®",
    specialistTitle: "Personal Finance Specialist",
    specialistAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80",
    date: "2026-09-18",
    dateFormatted: "September 18, 2026",
    time: "02:00 PM",
    durationMinutes: 30,
    consultationType: "video",
    status: "completed",
    createdAt: "2026-09-10T11:00:00Z",
    customer: {
      firstName: "Alex",
      lastName: "Mercer",
      email: "alex.mercer@gmail.com",
      phone: "+1 (555) 389-9921",
      contactMethod: "video",
      reason: "Initial diagnostic on cashflow velocity",
    },
  },
]

/**
 * Generate realistic appointment time slots
 */
export const AVAILABLE_SLOT_TIMES: { time: string; period: "morning" | "afternoon" | "evening" }[] = [
  { time: "09:00 AM", period: "morning" },
  { time: "10:00 AM", period: "morning" },
  { time: "11:30 AM", period: "morning" },
  { time: "01:30 PM", period: "afternoon" },
  { time: "02:00 PM", period: "afternoon" },
  { time: "03:30 PM", period: "afternoon" },
  { time: "04:30 PM", period: "afternoon" },
  { time: "05:30 PM", period: "evening" },
  { time: "06:30 PM", period: "evening" },
]
