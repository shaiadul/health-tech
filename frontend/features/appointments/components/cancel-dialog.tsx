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
import { Input } from "@/components/ui/input"
import { Appointment } from "@/types/appointment"
import { AppointmentService } from "../services/appointment.service"
import { AlertCircle, Loader2 } from "lucide-react"

interface CancelDialogProps {
  appointment: Appointment | null
  open: boolean
  onClose: () => void
  onCancelled: (id: string) => void
}

export function CancelDialog({
  appointment,
  open,
  onClose,
  onCancelled,
}: CancelDialogProps) {
  const [reason, setReason] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (!appointment) return null

  const handleConfirmCancel = async () => {
    setIsSubmitting(true)
    await AppointmentService.cancelAppointment(appointment.id, reason)
    setIsSubmitting(false)
    onCancelled(appointment.id)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md w-[calc(100vw-2rem)] p-6 sm:p-8 rounded-none border border-border bg-background shadow-2xl">
        <DialogHeader className="text-left space-y-2 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-destructive font-bold">
              Cancellation Request
            </span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Cancel Consultation?
          </DialogTitle>
          <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
            Your appointment with <strong className="text-foreground">{appointment.specialistName}</strong> is currently scheduled for <strong className="text-foreground">{appointment.dateFormatted} at {appointment.time}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-3">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-muted-foreground block">
              Reason for Cancellation (Optional)
            </label>
            <Input
              placeholder="e.g. Schedule conflict, will rebook later"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-10 rounded-none border-border bg-background text-sm focus:border-destructive"
            />
          </div>

          <div className="p-3.5 bg-muted/40 border border-border text-xs text-muted-foreground leading-relaxed">
            You can rebook at any time with zero penalties. Your specialist will be released and notified immediately.
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-none text-xs h-10 px-5 border-border hover:border-foreground"
            >
              Keep Appointment
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirmCancel}
              disabled={isSubmitting}
              className="rounded-none text-xs h-10 px-6 font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  <span>Cancelling...</span>
                </>
              ) : (
                "Confirm Cancellation"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
