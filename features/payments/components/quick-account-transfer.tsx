"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { quickTransferSchema, QuickTransferFormValues } from "../schemas/payment.schema"
import { BankAccount } from "@/types/account"
import { formatCurrency } from "@/lib/formatters"
import { ArrowLeftRight, Check, Loader2 } from "lucide-react"

interface QuickAccountTransferProps {
  accounts: BankAccount[]
}

export function QuickAccountTransfer({ accounts }: QuickAccountTransferProps) {
  const [success, setSuccess] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const form = useForm<QuickTransferFormValues>({
    resolver: zodResolver(quickTransferSchema),
    defaultValues: {
      fromAccountId: accounts[0]?.id || "",
      toAccountId: accounts[1]?.id || "",
      amount: 10000,
      note: "Treasury liquidity rebalancing",
    },
  })

  const onSubmit = async (values: QuickTransferFormValues) => {
    setLoading(true)
    setSuccess(false)
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 4000)
    form.reset({
      fromAccountId: values.fromAccountId,
      toAccountId: values.toAccountId,
      amount: 5000,
      note: "",
    })
  }

  return (
    <Card className="border border-border/80">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
            <ArrowLeftRight className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold">
              Inter-Vault Internal Transfer
            </CardTitle>
            <CardDescription className="text-xs">
              Zero-fee instant liquidity sweep between own accounts
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {success && (
          <div className="p-3 mb-3 bg-success/15 border border-success/30 text-success text-xs rounded-md flex items-center gap-2 font-medium">
            <Check className="h-4 w-4" />
            <span>Transfer settled instantly between internal vaults.</span>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="fromAccountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">From Vault</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accounts.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.name} ({formatCurrency(a.balance)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toAccountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">To Destination</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Destination" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accounts.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Amount (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="100"
                      className="h-8 text-xs font-mono"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full text-xs h-8 bg-secondary text-secondary-foreground hover:bg-secondary/80 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Moving Funds...
                </>
              ) : (
                "Execute Internal Rebalance"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
