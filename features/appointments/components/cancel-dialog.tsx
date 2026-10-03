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
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader className="text-left space-y-2">
          <div className="h-10 w-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertCircle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-lg font-bold">Cancel appointment?</DialogTitle>
          <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
            Your appointment with <strong className="text-foreground">{appointment.specialistName}</strong> is
            scheduled for <strong className="text-foreground">{appointment.dateFormatted} at {appointment.time}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Reason for Cancellation (Optional)
            </label>
            <Input
              placeholder="e.g. Schedule conflict, will rebook later"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-[11px] text-muted-foreground">
            You can rebook at any time with no penalties. Your specialist will be notified of this cancellation.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs h-9"
            >
              Keep Appointment
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmCancel}
              disabled={isSubmitting}
              className="text-xs h-9"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Appointment"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
