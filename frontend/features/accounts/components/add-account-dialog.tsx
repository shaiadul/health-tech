"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import {
  addAccountSchema,
  AddAccountFormValues,
} from "../schemas/account.schema"
import { AccountService } from "../services/account.service"
import { BankAccount } from "@/types/account"
import { Loader2 } from "lucide-react"

interface AddAccountDialogProps {
  open: boolean
  onClose: () => void
  onAccountAdded: (newAccount: BankAccount) => void
}

export function AddAccountDialog({
  open,
  onClose,
  onAccountAdded,
}: AddAccountDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<AddAccountFormValues>({
    resolver: zodResolver(addAccountSchema),
    defaultValues: {
      name: "",
      accountType: "checking",
      institutionName: "JPMorgan Chase Institutional",
      initialDeposit: 10000,
      routingNumber: "121000358",
      colorTheme: "navy",
    },
  })

  const onSubmit = async (values: AddAccountFormValues) => {
    setIsSubmitting(true)
    try {
      const created = await AccountService.createAccount({
        name: values.name,
        accountType: values.accountType,
        balance: Math.round(values.initialDeposit * 100),
        availableBalance: Math.round(values.initialDeposit * 100),
        currency: "USD",
        status: "active",
        routingNumber: values.routingNumber,
        institutionName: values.institutionName,
        colorTheme: values.colorTheme,
        initialDeposit: Math.round(values.initialDeposit * 100),
      })
      onAccountAdded(created)
      form.reset()
      onClose()
    } catch (err) {
      console.error("Account creation failed", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Open Institutional Account</DialogTitle>
          <DialogDescription>
            Provision a new high-yield reserve, operating clearing account, or revolving facility.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Identifier / Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. European Expansion Checking" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Structure</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="savings">High-Yield Reserve</SelectItem>
                        <SelectItem value="credit">Corporate Credit</SelectItem>
                        <SelectItem value="investment">Yield & T-Bills</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colorTheme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Theme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="navy">Executive Navy</SelectItem>
                        <SelectItem value="emerald">Reserve Emerald</SelectItem>
                        <SelectItem value="slate">Monochrome Slate</SelectItem>
                        <SelectItem value="indigo">Deep Indigo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="institutionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custodial Partner Bank</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Goldman Sachs Bank USA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="initialDeposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Deposit (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="100"
                        value={field.value}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="routingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fed Routing Number</FormLabel>
                    <FormControl>
                      <Input maxLength={9} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Provisioning...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
