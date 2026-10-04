import { ConsultationType } from "./specialist"

export type AppointmentStatus =
  | "confirmed"
  | "completed"
  | "rescheduled"
  | "cancelled"

export interface TimeSlot {
  id: string
  time: string // e.g. "09:00 AM"
  period: "morning" | "afternoon" | "evening"
  available: boolean
}

export interface DayAvailability {
  date: string // "YYYY-MM-DD"
  dayName: string // "Mon"
  dayNumber: number // 12
  isAvailable: boolean
  slots: TimeSlot[]
}

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  contactMethod: "video" | "phone" | "in_person" | "email"
  reason: string
  additionalNotes?: string
  bookingFor?: "self" | "dependent"
  insuranceType?: "commercial" | "medicare" | "self_pay"
}

export interface Appointment {
  id: string
  referenceNumber: string
  serviceId: string
  serviceTitle: string
  specialistId: string
  specialistName: string
  specialistTitle: string
  specialistAvatar: string
  date: string // "YYYY-MM-DD"
  dateFormatted: string // "October 12, 2026"
  time: string // "04:30 PM"
  durationMinutes: number
  consultationType: ConsultationType
  status: AppointmentStatus
  customer: CustomerInfo
  meetingLink?: string
  locationAddress?: string
  createdAt: string
  cancellationReason?: string
}

export interface BookingDraft {
  serviceId?: string
  specialistId?: string
  consultationType: ConsultationType
  date?: string
  time?: string
  customer?: CustomerInfo
}
