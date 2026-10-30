"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { paymentSchema, PaymentFormValues } from "../schemas/payment.schema"
import { PaymentService } from "../services/payment.service"
import { BankAccount } from "@/types/account"
import { Recipient, PaymentReceipt } from "@/types/payment"
import { formatCurrency, formatDateTime } from "@/lib/formatters"
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Building,
  User,
  Zap,
  Clock,
  Download,
} from "lucide-react"

interface PaymentWizardProps {
  accounts: BankAccount[]
  recipients: Recipient[]
  onPaymentSuccess?: () => void
}

type WizardStep = "recipient" | "details" | "review" | "receipt"

export function PaymentWizard({
  accounts,
  recipients,
  onPaymentSuccess,
}: PaymentWizardProps) {
  const [currentStep, setCurrentStep] = React.useState<WizardStep>("recipient")
  const [receipt, setReceipt] = React.useState<PaymentReceipt | null>(null)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      fromAccountId: accounts[0]?.id || "",
      recipientId: recipients[0]?.id || "",
      recipientName: recipients[0]?.name || "",
      amount: 5000,
      paymentMethod: "instant",
      note: "Standard vendor disbursement",
    },
  })

  const selectedRecipientId = form.watch("recipientId")
  const selectedRecipient = recipients.find((r) => r.id === selectedRecipientId)
  const selectedAccountId = form.watch("fromAccountId")
  const selectedAccount = accounts.find((a) => a.id === selectedAccountId)
  const amount = form.watch("amount")
  const paymentMethod = form.watch("paymentMethod")

  // Calculate rail fee
  const railFeeInCents = paymentMethod === "wire" ? 2500 : 0
  const amountInCents = Math.round((amount || 0) * 100)
  const totalChargeInCents = amountInCents + railFeeInCents

  const handleNextFromRecipient = () => {
    if (!form.getValues("recipientId")) {
      form.setError("recipientId", { message: "Please select a payee" })
      return
    }
    setCurrentStep("details")
  }

  const handleNextFromDetails = async () => {
    const isValid = await form.trigger(["fromAccountId", "amount", "paymentMethod", "note"])
    if (isValid) {
      setCurrentStep("review")
    }
  }

  const handleExecutePayment = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const values = form.getValues()
      const res = await PaymentService.executePayment({
        fromAccountId: values.fromAccountId,
        recipientId: values.recipientId,
        recipientName: selectedRecipient?.name || values.recipientName,
        amount: amountInCents,
        note: values.note,
        paymentMethod: values.paymentMethod,
        category: "Technology & Software",
      })

      if (res.success && res.receipt) {
        setReceipt(res.receipt)
        setCurrentStep("receipt")
        onPaymentSuccess?.()
      } else {
        setErrorMessage(res.error || "Payment execution failed.")
      }
    } catch {
      setErrorMessage("An unexpected network fault occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    form.reset({
      fromAccountId: accounts[0]?.id || "",
      recipientId: recipients[0]?.id || "",
      recipientName: recipients[0]?.name || "",
      amount: 1000,
      paymentMethod: "instant",
      note: "",
    })
    setReceipt(null)
    setErrorMessage(null)
    setCurrentStep("recipient")
  }

  return (
    <Card className="border border-border/80 shadow-xs">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-bold">Disbursement Workflow</CardTitle>
            <CardDescription className="text-xs">
              Execute multi-rail vendor payments, team payouts, and wire transfers
            </CardDescription>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className={`font-semibold px-2 py-0.5 rounded-md ${
                currentStep === "recipient"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              1. Recipient
            </span>
            <span>→</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-md ${
                currentStep === "details"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              2. Amount
            </span>
            <span>→</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-md ${
                currentStep === "review"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              3. Review
            </span>
            <span>→</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-md ${
                currentStep === "receipt"
                  ? "bg-success text-success-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              4. Complete
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Transfer Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          {/* STEP 1: Select Recipient */}
          {currentStep === "recipient" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Select Verified Payee / Counterparty
                </h3>
                <p className="text-xs text-muted-foreground">
                  Choose from authorized enterprise vendors, verified contractor profiles, or team members.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {recipients.map((rec) => {
                  const isSelected = selectedRecipientId === rec.id
                  return (
                    <div
                      key={rec.id}
                      onClick={() => {
                        form.setValue("recipientId", rec.id)
                        form.setValue("recipientName", rec.name)
                      }}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                          : "border-border/80 hover:border-border hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                            {rec.category === "team" ? (
                              <User className="h-3.5 w-3.5" />
                            ) : (
                              <Building className="h-3.5 w-3.5" />
                            )}
                          </div>
                          <span className="text-xs font-semibold text-foreground truncate max-w-[150px]">
                            {rec.name}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {rec.category}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pl-9">
                        <span>{rec.bankName}</span>
                        <span className="font-mono">{rec.accountNumberMasked}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <Button onClick={handleNextFromRecipient} className="gap-1.5">
                  <span>Continue to Amount</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Amount & Funding Account */}
          {currentStep === "details" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Transfer Specifics
                </h3>
                <p className="text-xs text-muted-foreground">
                  Paying: <strong className="text-foreground">{selectedRecipient?.name}</strong> (
                  {selectedRecipient?.bankName} {selectedRecipient?.accountNumberMasked})
                </p>
              </div>

              {/* Source Account */}
              <FormField
                control={form.control}
                name="fromAccountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Originating Account</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select funding account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accounts.map((acc) => (
                          <SelectItem key={acc.id} value={acc.id}>
                            {acc.name} — Available: {formatCurrency(acc.availableBalance)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disbursement Amount (USD)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-muted-foreground font-mono font-medium">
                          $
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-7 font-mono text-base font-semibold"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Settlement Rail */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Settlement Network & Speed</FormLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div
                        onClick={() => field.onChange("instant")}
                        className={`p-3 rounded-lg border cursor-pointer text-xs ${
                          field.value === "instant"
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-semibold text-foreground mb-0.5">
                          <Zap className="h-3.5 w-3.5 text-primary" />
                          <span>Instant / FedNow</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">Within 10 seconds • $0.00 fee</p>
                      </div>

                      <div
                        onClick={() => field.onChange("ach")}
                        className={`p-3 rounded-lg border cursor-pointer text-xs ${
                          field.value === "ach"
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-semibold text-foreground mb-0.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>ACH Standard</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">Next business day • $0.00 fee</p>
                      </div>

                      <div
                        onClick={() => field.onChange("wire")}
                        className={`p-3 rounded-lg border cursor-pointer text-xs ${
                          field.value === "wire"
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-semibold text-foreground mb-0.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-info" />
                          <span>Fedwire RTGS</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">Immediate irrevocable • $25.00 fee</p>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Memo Note */}
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remittance Advice / Invoice Reference</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. October compute capacity invoice #8821" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep("recipient")}
                  className="gap-1.5 text-xs"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </Button>
                <Button type="button" onClick={handleNextFromDetails} className="gap-1.5">
                  <span>Review Authorization</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Authorize */}
          {currentStep === "review" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Authorization & Compliance Review
                </h3>
                <p className="text-xs text-muted-foreground">
                  Verify the fund transfer specifications before signing and broadcasting.
                </p>
              </div>

              {/* Breakdown Sheet */}
              <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Counterparty Payee</span>
                  <span className="font-semibold text-foreground">{selectedRecipient?.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Destination Institution</span>
                  <span className="font-medium text-foreground">
                    {selectedRecipient?.bankName} ({selectedRecipient?.accountNumberMasked})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Source Vault</span>
                  <span className="font-medium text-foreground">{selectedAccount?.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Settlement Rail</span>
                  <span className="font-medium text-foreground uppercase">{paymentMethod}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Disbursement Principal</span>
                  <span className="font-mono font-semibold text-foreground">
                    {formatCurrency(amountInCents)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Network Rail Processing Fee</span>
                  <span className="font-mono font-medium text-foreground">
                    {formatCurrency(railFeeInCents)}
                  </span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-sm">
                  <span className="text-foreground">Total Deduction</span>
                  <span className="font-mono text-primary">{formatCurrency(totalChargeInCents)}</span>
                </div>
              </div>

              <div className="p-3 bg-muted/20 border border-border/60 rounded-lg flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-success shrink-0" />
                <span>
                  Anti-fraud dual control check: Transaction falls within authorized corporate limits.
                </span>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep("details")}
                  disabled={isSubmitting}
                  className="gap-1.5 text-xs"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Modify</span>
                </Button>
                <Button
                  type="button"
                  onClick={handleExecutePayment}
                  disabled={isSubmitting}
                  className="gap-2 min-w-36"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      Sign & Broadcast
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation Receipt */}
          {currentStep === "receipt" && receipt && (
            <div className="py-6 space-y-4 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-success/15 text-success flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Disbursement Confirmed & Broadcast
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Reference: <span className="font-mono font-medium text-foreground">{receipt.referenceNumber}</span>
                </p>
              </div>

              <div className="p-4 bg-muted/40 rounded-xl border border-border/80 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-mono font-bold text-foreground">
                    {formatCurrency(receipt.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recipient:</span>
                  <span className="font-medium text-foreground">{receipt.recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">From Account:</span>
                  <span className="font-medium text-foreground">{receipt.fromAccountName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timestamp:</span>
                  <span className="font-mono text-foreground">{formatDateTime(receipt.timestamp)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="success" className="text-[10px]">
                    Settled & Cleared
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    alert(`Receipt ${receipt.referenceNumber} downloaded successfully.`)
                  }}
                  className="gap-1.5 text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Audit Receipt</span>
                </Button>
                <Button onClick={handleReset} className="text-xs">
                  Initiate Another Transfer
                </Button>
              </div>
            </div>
          )}
        </Form>
      </CardContent>
    </Card>
  )
}
