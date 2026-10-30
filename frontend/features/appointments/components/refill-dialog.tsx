"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pill, CheckCircle2, Building, ShieldCheck, Clock, AlertCircle } from "lucide-react"

export interface MedicationItem {
  id: string
  name: string
  dosage: string
  frequency: string
  refillsRemaining: number
  prescribedBy: string
  rxNumber: string
}

interface RefillDialogProps {
  medication: MedicationItem | null
  open: boolean
  onClose: () => void
  onSuccess: (medId: string) => void
}

export function RefillDialog({
  medication,
  open,
  onClose,
  onSuccess,
}: RefillDialogProps) {
  const [selectedPharmacy, setSelectedPharmacy] = React.useState("cvs_downtown")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)

  const handleClose = () => {
    setSubmitted(false)
    setIsSubmitting(false)
    onClose()
  }

  if (!medication) return null

  const handleConfirmRefill = async () => {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 650))
    setIsSubmitting(false)
    setSubmitted(true)
    setTimeout(() => {
      onSuccess(medication.id)
      handleClose()
    }, 1200)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border rounded-3xl p-6 shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Pill className="h-4 w-4" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">
              Request Medication Refill
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground font-mono">
            Direct e-prescription refill request sent to MedPulse Pharmacy Network.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-base font-bold text-foreground">
              Refill Order Submitted!
            </h4>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Your prescription for <span className="font-semibold text-foreground">{medication.name}</span> has been routed to your chosen pharmacy for approval.
            </p>
          </div>
        ) : (
          <div className="space-y-5 py-2">
            {/* Medication Card Details */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    {medication.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {medication.dosage} · {medication.frequency}
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                  Rx #{medication.rxNumber}
                </Badge>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>Prescribing Doctor: {medication.prescribedBy}</span>
                <span className="text-emerald-600 font-semibold">
                  {medication.refillsRemaining} refills left
                </span>
              </div>
            </div>

            {/* Select Pickup Pharmacy */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Designated Pickup Pharmacy
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: "cvs_downtown",
                    name: "MedPulse In-Clinic Dispensary",
                    address: "Ground Floor · West Wing (Ready in 30 mins)",
                    badge: "Fastest",
                  },
                  {
                    id: "walgreens_metro",
                    name: "Walgreens Pharmacy #4821",
                    address: "1420 Metro Blvd, Boston MA (Next day delivery)",
                    badge: "Home Delivery",
                  },
                ].map((pharma) => (
                  <button
                    key={pharma.id}
                    type="button"
                    onClick={() => setSelectedPharmacy(pharma.id)}
                    className={`p-3 rounded-xl border text-left flex items-start justify-between gap-2 transition-all cursor-pointer ${
                      selectedPharmacy === pharma.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Building className="h-3.5 w-3.5 text-primary" />
                        <span>{pharma.name}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        {pharma.address}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[9px] font-mono shrink-0">
                      {pharma.badge}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-2.5 text-xs text-blue-700 dark:text-blue-300">
              <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
              <p className="text-[11px]">
                Prescription refills are automatically cross-checked against your medical allergies and active drug interactions before dispatch.
              </p>
            </div>

            <DialogFooter className="flex sm:justify-between gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmRefill}
                disabled={isSubmitting}
                className="rounded-xl text-xs font-semibold gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="h-3.5 w-3.5 animate-spin" />
                    <span>Transmitting to Pharmacy...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Confirm & Transmit Refill</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
