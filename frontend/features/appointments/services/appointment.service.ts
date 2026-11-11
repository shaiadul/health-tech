import { INITIAL_USER_APPOINTMENTS, AVAILABLE_SLOT_TIMES } from "@/data/appointments"
import { FINANCIAL_SERVICES } from "@/data/services"
import { SPECIALISTS } from "@/data/specialists"
import {
  Appointment,
  BookingDraft,
  DayAvailability,
  TimeSlot,
} from "@/types/appointment"
import {
  createAppointmentAction,
  getAppointmentsAction,
  updateAppointmentStatusAction,
  rescheduleAppointmentAction,
} from "@/lib/actions"

// In-memory store for session appointments
let appointmentsStore: Appointment[] = [...INITIAL_USER_APPOINTMENTS]

export const AppointmentService = {
  /**
   * Generates upcoming available dates for the scheduler (next 14 days)
   */
  async getAvailableDates(): Promise<DayAvailability[]> {
    const days: DayAvailability[] = []
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const today = new Date()

    for (let i = 1; i <= 14; i++) {
      const d = new Date()
      d.setDate(today.getDate() + i)
      const isWeekend = d.getDay() === 0 || d.getDay() === 6
      const dateStr = d.toISOString().split("T")[0]

      days.push({
        date: dateStr,
        dayName: dayNames[d.getDay()],
        dayNumber: d.getDate(),
        isAvailable: !isWeekend,
        slots: isWeekend
          ? []
          : AVAILABLE_SLOT_TIMES.map((slot, index) => ({
              id: `slot_${dateStr}_${index}`,
              time: slot.time,
              period: slot.period,
              available: !(index === 2 || index === 5), // mark couple slots booked for realism
            })),
      })
    }

    return days
  },

  /**
   * Returns slots for a specific specialist and date
   */
  async getSlotsForDate(
    specialistId: string,
    date: string
  ): Promise<TimeSlot[]> {
    // Deterministic simulation based on date string hash
    const dateNum = date.split("-").reduce((acc, part) => acc + parseInt(part), 0)

    return AVAILABLE_SLOT_TIMES.map((slot, idx) => ({
      id: `slot_${date}_${idx}`,
      time: slot.time,
      period: slot.period,
      available: (dateNum + idx) % 4 !== 0,
    }))
  },

  /**
   * Creates and confirms an appointment
   */
  async createAppointment(draft: BookingDraft): Promise<Appointment> {
    const service = FINANCIAL_SERVICES.find((s) => s.id === draft.serviceId) || FINANCIAL_SERVICES[0]
    const specialist = SPECIALISTS.find((sp) => sp.id === draft.specialistId) || SPECIALISTS[0]

    try {
      const res = await createAppointmentAction({
        patientName: draft.customer ? `${draft.customer.firstName} ${draft.customer.lastName}` : "Alex Mercer",
        patientEmail: draft.customer?.email || "alex.mercer@gmail.com",
        patientPhone: draft.customer?.phone || "+1 (555) 389-9921",
        specialistId: specialist.id,
        serviceId: service.id,
        date: draft.date || new Date().toISOString().split("T")[0],
        timeSlot: draft.time || "10:00 AM",
        format: draft.consultationType === "video" ? "video" : "in_person",
        symptoms: draft.customer?.reason || "General clinical review",
      })

      if (res.success && res.data) {
        const aptData = res.data
        const dateObj = new Date(aptData.date)
        const dateFormatted = dateObj.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })

        const mappedApt: Appointment = {
          id: aptData.id,
          referenceNumber: aptData.reference,
          serviceId: aptData.serviceId,
          serviceTitle: aptData.serviceName,
          specialistId: aptData.specialistId,
          specialistName: aptData.specialistName,
          specialistTitle: aptData.specialistTitle || specialist.title,
          specialistAvatar: aptData.specialistAvatar || specialist.avatar,
          date: aptData.date,
          dateFormatted,
          time: aptData.timeSlot,
          durationMinutes: service.durationMinutes,
          consultationType: aptData.format === "video" ? "video" : "in_person",
          status: aptData.status,
          meetingLink: aptData.meetingUrl || `/consultation/${aptData.reference.toLowerCase()}`,
          locationAddress: "MedPulse Hospital Main Campus · 742 Healthcare Ave, Floor 4",
          createdAt: aptData.createdAt,
          customer: {
            firstName: draft.customer?.firstName || "Alex",
            lastName: draft.customer?.lastName || "Mercer",
            email: aptData.patientEmail,
            phone: aptData.patientPhone || "+1 (555) 389-9921",
            contactMethod: draft.consultationType || "video",
            reason: aptData.symptoms || "Clinical medical consultation",
          },
        }

        appointmentsStore = [mappedApt, ...appointmentsStore]
        return mappedApt
      }
    } catch {
      // Fallback
    }

    const ref = `MED-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    const aptId = `apt_${Date.now().toString(36)}`

    const dateObj = draft.date ? new Date(draft.date) : new Date()
    const dateFormatted = dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })

    const newAppointment: Appointment = {
      id: aptId,
      referenceNumber: ref,
      serviceId: service.id,
      serviceTitle: service.title,
      specialistId: specialist.id,
      specialistName: specialist.name,
      specialistTitle: specialist.title,
      specialistAvatar: specialist.avatar,
      date: draft.date || new Date().toISOString().split("T")[0],
      dateFormatted,
      time: draft.time || "10:00 AM",
      durationMinutes: service.durationMinutes,
      consultationType: draft.consultationType || "video",
      status: "confirmed",
      meetingLink: `/consultation/${ref.toLowerCase()}`,
      locationAddress: "MedPulse Hospital Main Campus · 742 Healthcare Ave, Floor 4",
      createdAt: new Date().toISOString(),
      customer: draft.customer || {
        firstName: "Alex",
        lastName: "Mercer",
        email: "alex.mercer@gmail.com",
        phone: "+1 (555) 389-9921",
        contactMethod: draft.consultationType || "video",
        reason: "Clinical medical consultation",
      },
    }

    appointmentsStore = [newAppointment, ...appointmentsStore]
    return newAppointment
  },

  /**
   * Retrieves all appointments for the current customer
   */
  async getUserAppointments(): Promise<{
    upcoming: Appointment[]
    past: Appointment[]
  }> {
    const upcoming = appointmentsStore.filter(
      (a) => a.status === "confirmed" || a.status === "rescheduled"
    )
    const past = appointmentsStore.filter(
      (a) => a.status === "completed" || a.status === "cancelled"
    )

    return { upcoming, past }
  },

  async getById(id: string): Promise<Appointment | null> {
    const apt = appointmentsStore.find((a) => a.id === id)
    return apt || null
  },

  /**
   * Reschedules an appointment to a new date and time
   */
  async rescheduleAppointment(
    id: string,
    newDate: string,
    newTime: string
  ): Promise<Appointment | null> {
    try {
      const res = await rescheduleAppointmentAction(id, newDate, newTime)
      if (res.success && res.data) {
        const aptData = res.data
        const index = appointmentsStore.findIndex((a) => a.id === id)
        if (index !== -1) {
          appointmentsStore[index] = {
            ...appointmentsStore[index],
            date: aptData.date,
            time: aptData.timeSlot,
            status: "rescheduled",
          }
          return appointmentsStore[index]
        }
      }
    } catch {
      // Fallback
    }

    const index = appointmentsStore.findIndex((a) => a.id === id)
    if (index === -1) return null

    const target = appointmentsStore[index]
    const dateObj = new Date(newDate)
    const dateFormatted = dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })

    const updated: Appointment = {
      ...target,
      date: newDate,
      dateFormatted,
      time: newTime,
      status: "rescheduled",
    }

    appointmentsStore[index] = updated
    return updated
  },

  /**
   * Cancels an appointment
   */
  async cancelAppointment(id: string, reason?: string): Promise<boolean> {
    try {
      await updateAppointmentStatusAction(id, "cancelled", reason)
    } catch {
      // Fallback
    }

    const index = appointmentsStore.findIndex((a) => a.id === id)
    if (index === -1) return false

    appointmentsStore[index] = {
      ...appointmentsStore[index],
      status: "cancelled",
      cancellationReason: reason || "Customer request",
    }
    return true
  },
}
