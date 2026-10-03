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
import { Calendar, Clock, Loader2, Check } from "lucide-react"

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

  const currentDaySlots = dates.find((d) => d.date === selectedDate)?.slots || []

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
          <DialogDescription className="text-xs">
            Current booking: {appointment.dateFormatted} at {appointment.time} with {appointment.specialistName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Day selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Select New Date
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {dates.map((day) => {
                const isSelected = selectedDate === day.date
                return (
                  <button
                    key={day.date}
                    type="button"
                    disabled={!day.isAvailable}
                    onClick={() => setSelectedDate(day.date)}
                    className={`flex flex-col items-center justify-center min-w-[58px] h-[64px] rounded-lg border text-center transition-all ${
                      !day.isAvailable
                        ? "opacity-30 cursor-not-allowed border-border/40 bg-muted/10"
                        : isSelected
                        ? "border-primary bg-primary text-primary-foreground font-bold shadow-xs"
                        : "border-border bg-card hover:bg-muted/20"
                    }`}
                  >
                    <span className="text-[10px] font-medium uppercase">{day.dayName}</span>
                    <span className="text-base font-bold font-mono">{day.dayNumber}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Select Available Time Slot
            </label>
            <div className="grid grid-cols-3 gap-2">
              {AVAILABLE_SLOT_TIMES.map((slot) => {
                const isSelected = selectedTime === slot.time
                return (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => setSelectedTime(slot.time)}
                    className={`p-2.5 rounded-lg border text-xs font-mono font-medium transition-all ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground font-bold shadow-xs"
                        : "border-border bg-card hover:bg-muted/20 text-foreground"
                    }`}
                  >
                    {slot.time}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border/60 text-xs text-muted-foreground">
            <p>
              Your updated time will be <strong className="text-foreground">{selectedDate}</strong> at{" "}
              <strong className="text-foreground">{selectedTime}</strong>. A calendar update will be dispatched.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting} className="text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirmReschedule} disabled={isSubmitting} className="text-xs">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Updating...
                </>
              ) : (
                "Confirm New Slot"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
