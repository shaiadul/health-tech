"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { paymentSchema, PaymentFormValues } from "@/features/payments/schemas/payment.schema"
import { PaymentService } from "@/features/payments/services/payment.service"
import { MOCK_ACCOUNTS } from "@/data/accounts"
import { MOCK_RECIPIENTS } from "@/data/analytics"
import { formatCurrency } from "@/lib/formatters"
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react"

export type QuickActionType = "send" | "add" | "bill" | "transfer" | null

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
    ref: string
    amount: number
    recipient: string
  } | null>(null)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      fromAccountId: MOCK_ACCOUNTS[0]?.id || "",
      recipientId: MOCK_RECIPIENTS[0]?.id || "",
      recipientName: MOCK_RECIPIENTS[0]?.name || "",
      amount: 1500,
      paymentMethod: "ach",
      note: "",
    },
  })

  // Reset state when dialog opens
  React.useEffect(() => {
    if (action) {
      setSuccessReceipt(null)
      setErrorMessage(null)
      form.reset({
        fromAccountId: MOCK_ACCOUNTS[0]?.id || "",
        recipientId: MOCK_RECIPIENTS[0]?.id || "",
        recipientName: MOCK_RECIPIENTS[0]?.name || "",
        amount: action === "bill" ? 450 : 2500,
        paymentMethod: "instant",
        note: action === "bill" ? "Monthly utility invoice payment" : "Operational transfer",
      })
    }
  }, [action, form])

  const onSubmit = async (values: PaymentFormValues) => {
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      // Find selected recipient
      const rec = MOCK_RECIPIENTS.find((r) => r.id === values.recipientId)
      const recipientName = rec ? rec.name : values.recipientName

      // Amount in minor units (cents)
      const minorAmount = Math.round(values.amount * 100)

      const result = await PaymentService.executePayment({
        fromAccountId: values.fromAccountId,
        recipientId: values.recipientId,
        recipientName,
        amount: minorAmount,
        note: values.note,
        paymentMethod: values.paymentMethod,
        category: action === "bill" ? "Utilities & Telecommunications" : "Payroll & Income",
      })

      if (result.success && result.receipt) {
        setSuccessReceipt({
          ref: result.receipt.referenceNumber,
          amount: minorAmount,
          recipient: recipientName,
        })
        if (onSuccess) onSuccess()
      } else {
        setErrorMessage(result.error || "Payment execution failed.")
      }
    } catch {
      setErrorMessage("An unexpected network error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDialogTitle = () => {
    switch (action) {
      case "send":
        return "Disburse Funds"
      case "add":
        return "Inbound Liquidity Transfer"
      case "bill":
        return "Pay Commercial Invoice"
      case "transfer":
        return "Inter-Account Transfer"
      default:
        return "Execute Transaction"
    }
  }

  return (
    <Dialog open={!!action} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            Execute simulated institutional funds flow with verified routing.
          </DialogDescription>
        </DialogHeader>

        {successReceipt ? (
          <div className="py-6 space-y-4 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-success/15 text-success flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-foreground">
                Payment Successfully Queued
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Reference: <span className="font-mono font-medium">{successReceipt.ref}</span>
              </p>
            </div>
            <div className="p-3.5 bg-muted/50 rounded-lg text-left text-xs space-y-1.5 border border-border">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(successReceipt.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recipient:</span>
                <span className="font-medium text-foreground">{successReceipt.recipient}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-success font-medium">Settled to ledger</span>
              </div>
            </div>
            <Button className="w-full" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertTitle>Execution Failed</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {/* Source Account */}
              <FormField
                control={form.control}
                name="fromAccountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Funding Account</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MOCK_ACCOUNTS.map((acc) => (
                          <SelectItem key={acc.id} value={acc.id}>
                            {acc.name} ({formatCurrency(acc.balance)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Recipient */}
              <FormField
                control={form.control}
                name="recipientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Counterparty / Recipient</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val)
                        const match = MOCK_RECIPIENTS.find((r) => r.id === val)
                        if (match) form.setValue("recipientName", match.name)
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recipient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MOCK_RECIPIENTS.map((rec) => (
                          <SelectItem key={rec.id} value={rec.id}>
                            {rec.name} ({rec.bankName})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amount and Method */}
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (USD)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Settlement Rail</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Rail" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="instant">FedNow / Instant ($0)</SelectItem>
                          <SelectItem value="ach">ACH Standard ($0)</SelectItem>
                          <SelectItem value="wire">Fedwire Same-Day ($25)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Note */}
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Internal Memo / Invoice Reference</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Q3 Cloud infrastructure reserve" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="min-w-32">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authorizing...
                    </>
                  ) : (
                    <>
                      Confirm & Send
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
