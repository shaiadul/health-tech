"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, Loader2, Stethoscope, UserPlus } from "lucide-react"

export type QuickActionType = "send" | "add" | "bill" | "transfer" | "triage" | "schedule" | null

interface QuickActionDialogsProps {
  action: QuickActionType
  onClose: () => void
  onSuccess?: () => void
}

export function QuickActionDialogs({
  action,
  onClose,
  onSuccess,
}: QuickActionDialogsProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [successReceipt, setSuccessReceipt] = React.useState<{
    patientName: string
    department: string
    refNumber: string
  } | null>(null)

  const [patientName, setPatientName] = React.useState("")
  const [department, setDepartment] = React.useState("Cardiology & Heart Health")
  const [doctor, setDoctor] = React.useState("Dr. Sarah Ahmed, MD")
  const [symptoms, setSymptoms] = React.useState("")

  if (!action) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      const ref = `CLINIC-${Math.floor(100000 + Math.random() * 900000)}`
      setSuccessReceipt({
        patientName: patientName || "Walk-In Patient",
        department,
        refNumber: ref,
      })
      if (onSuccess) onSuccess()
    }, 600)
  }

  const handleClose = () => {
    setSuccessReceipt(null)
    setPatientName("")
    setSymptoms("")
    onClose()
  }

  return (
    <Dialog open={!!action} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md w-[calc(100vw-2rem)] p-6 bg-background border border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <span>Walk-In Patient Triage Intake</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Instantly register a walk-in patient or telephone intake directly into the outpatient triage queue.
          </DialogDescription>
        </DialogHeader>

        {successReceipt ? (
          <div className="space-y-4 py-4">
            <Alert className="border-emerald-500/50 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <AlertTitle className="font-semibold text-xs">Patient Added to Queue</AlertTitle>
              <AlertDescription className="text-xs">
                {successReceipt.patientName} registered for {successReceipt.department}.
              </AlertDescription>
            </Alert>

            <div className="p-4 bg-muted/40 border border-border text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Queue Reference:</span>
                <span className="font-bold text-foreground">{successReceipt.refNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Triage Status:</span>
                <span className="text-amber-500 font-semibold">Waiting Room</span>
              </div>
            </div>

            <Button
              className="w-full text-xs font-semibold bg-primary text-primary-foreground"
              onClick={handleClose}
            >
              Done & Return to Queue
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Patient Full Name</label>
              <Input
                required
                placeholder="e.g. Michael Chen"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Department</label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cardiology & Heart Health">Cardiology</SelectItem>
                  <SelectItem value="Neurology & Brain Health">Neurology</SelectItem>
                  <SelectItem value="Pediatrics & Child Wellness">Pediatrics</SelectItem>
                  <SelectItem value="Orthopedics & Sports Medicine">Orthopedics</SelectItem>
                  <SelectItem value="Internal & General Medicine">Internal Medicine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Assign Doctor</label>
              <Select value={doctor} onValueChange={setDoctor}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. Sarah Ahmed, MD">Dr. Sarah Ahmed, MD (Cardiology)</SelectItem>
                  <SelectItem value="Dr. Marcus Vance, MD">Dr. Marcus Vance, MD (Neurology)</SelectItem>
                  <SelectItem value="Dr. Elena Rostova, MD">Dr. Elena Rostova, MD (Pediatrics)</SelectItem>
                  <SelectItem value="Dr. David Kim, MD">Dr. David Kim, MD (Orthopedics)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Chief Symptoms / Reason</label>
              <Textarea
                placeholder="Brief description of symptoms, vital signs, or clinical notes..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="text-xs min-h-[70px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={handleClose} className="text-xs h-9">
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="text-xs h-9 bg-primary text-primary-foreground gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Stethoscope className="h-3.5 w-3.5" />
                    <span>Admit to Queue</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
