"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Appointment, DayAvailability } from "@/types/appointment"
import { AppointmentService } from "../services/appointment.service"
import { AVAILABLE_SLOT_TIMES } from "@/data/appointments"
import { Calendar, Clock, Loader2, Check, ArrowRight, ShieldCheck } from "lucide-react"

interface RescheduleDialogProps {
  appointment: Appointment | null
  open: boolean
  onClose: () => void
  onRescheduled: (updated: Appointment) => void
}

export function RescheduleDialog({
  appointment,
  open,
  onClose,
  onRescheduled,
}: RescheduleDialogProps) {
  const [dates, setDates] = React.useState<DayAvailability[]>([])
  const [selectedDate, setSelectedDate] = React.useState<string>("")
  const [selectedTime, setSelectedTime] = React.useState<string>("10:00 AM")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      AppointmentService.getAvailableDates().then((d) => {
        setDates(d)
        const firstAvail = d.find((item) => item.isAvailable)?.date || ""
        setSelectedDate(firstAvail)
      })
    }
  }, [open])

  if (!appointment) return null

  const handleConfirmReschedule = async () => {
    if (!selectedDate || !selectedTime) return
    setIsSubmitting(true)
    const updated = await AppointmentService.rescheduleAppointment(
      appointment.id,
      selectedDate,
      selectedTime
    )
    setIsSubmitting(false)
    if (updated) {
      onRescheduled(updated)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-none border border-border bg-background shadow-2xl">
        <DialogHeader className="space-y-2 text-left border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-bold">
              Fiduciary Scheduling
            </span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Reschedule Consultation
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Move your session with <strong className="text-foreground">{appointment.specialistName}</strong> to a more convenient time without any penalty.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Current vs New Slot Comparison Strip */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-muted/40 border border-border text-xs font-mono">
            <div>
              <span className="text-[10px] uppercase text-muted-foreground block">
                Current Time
              </span>
              <span className="text-foreground font-semibold block mt-0.5 line-through opacity-75">
                {appointment.dateFormatted}
              </span>
              <span className="text-muted-foreground text-[11px]">
                {appointment.time}
              </span>
            </div>

            <div className="border-l border-border pl-3">
              <span className="text-[10px] uppercase text-primary font-semibold block">
                New Proposed Slot
              </span>
              <span className="text-foreground font-bold block mt-0.5">
                {selectedDate || "Select date below"}
              </span>
              <span className="text-primary font-semibold text-[11px]">
                {selectedTime}
              </span>
            </div>
          </div>

          {/* Date Picker Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">1. Select New Date</span>
              <span className="font-mono text-[11px] text-muted-foreground">Upcoming 14 Days</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {dates.slice(0, 14).map((day) => {
                const isSelected = selectedDate === day.date
                return (
                  <button
                    key={day.date}
                    type="button"
                    disabled={!day.isAvailable}
                    onClick={() => setSelectedDate(day.date)}
                    className={`p-2 border text-center transition-all ${
                      !day.isAvailable
                        ? "opacity-25 cursor-not-allowed border-border/50 bg-muted/10 line-through text-muted-foreground"
                        : isSelected
                        ? "border-primary bg-primary text-primary-foreground font-bold"
                        : "border-border hover:border-primary text-foreground bg-background"
                    }`}
                  >
                    <span className="block text-[9px] uppercase font-mono">{day.dayName}</span>
                    <span className="block text-sm font-mono font-bold mt-0.5">{day.dayNumber}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time Slots Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">2. Select New Time</span>
              <span className="font-mono text-[11px] text-muted-foreground">Eastern Time (US)</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {AVAILABLE_SLOT_TIMES.map((slot) => {
                const isSelected = selectedTime === slot.time
                return (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => setSelectedTime(slot.time)}
                    className={`py-2 px-1 text-center border font-mono text-xs transition-all ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground font-bold"
                        : "border-border hover:border-primary text-foreground bg-background"
                    }`}
                  >
                    {slot.time}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Security & Calendar Dispatch Notice */}
          <div className="flex items-center gap-2.5 text-[11px] font-mono text-muted-foreground pt-1">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>Updated calendar invite and video room links will be automatically sent.</span>
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-none text-xs h-10 px-5 border-border hover:border-foreground"
            >
              Keep Existing Time
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleConfirmReschedule}
              disabled={isSubmitting || !selectedDate || !selectedTime}
              className="rounded-none text-xs h-10 px-6 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Updating Calendar...</span>
                </>
              ) : (
                <>
                  <span>Confirm New Schedule</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
