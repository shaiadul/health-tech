"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from "@/components/ui/card"
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
import { quickLeadSchema, QuickLeadFormValues } from "@/features/leads/schemas/lead.schema"
import { LeadService } from "@/features/leads/services/lead.service"
import { FINANCIAL_SERVICES } from "@/data/services"
import { Sparkles, CheckCircle2, Loader2, ArrowRight } from "lucide-react"

export function LeadCaptureSection() {
  const [success, setSuccess] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const form = useForm<QuickLeadFormValues>({
    resolver: zodResolver(quickLeadSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      serviceInterest: FINANCIAL_SERVICES[0].title,
    },
  })

  const onSubmit = async (values: QuickLeadFormValues) => {
    setLoading(true)
    await LeadService.submitLead({
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      serviceInterest: values.serviceInterest,
    })
    setLoading(false)
    setSuccess(true)
    form.reset()
  }

  return (
    <section className="py-16 md:py-20 border-t border-border/60 bg-gradient-to-br from-primary/5 via-card to-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border border-primary/20 shadow-xl overflow-hidden bg-card/90 backdrop-blur-md">
          <CardContent className="p-8 sm:p-10">
            {success ? (
              <div className="text-center py-8 space-y-4">
                <div className="mx-auto h-12 w-12 rounded-full bg-success/15 text-success flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Inquiry Received!
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  A senior fiduciary specialist will review your request and send custom consultation slot recommendations to your email.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSuccess(false)}
                  className="text-xs"
                >
                  Submit Another Inquiry
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-3 text-center lg:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Free Advisory Strategy</span>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-foreground">
                    Want personalized financial guidance?
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Leave your contact info and tell us what you&apos;re solving for. A matched specialist will prepare initial benchmarking before your call.
                  </p>
                </div>

                <div className="lg:col-span-7">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Alex Vance" className="h-9 text-xs" {...field} />
                              </FormControl>
                              <FormMessage className="text-[10px]" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Email</FormLabel>
                              <FormControl>
                                <Input placeholder="alex@company.com" type="email" className="h-9 text-xs" {...field} />
                              </FormControl>
                              <FormMessage className="text-[10px]" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Phone (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 (555) 000-0000" className="h-9 text-xs" {...field} />
                              </FormControl>
                              <FormMessage className="text-[10px]" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="serviceInterest"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Primary Interest</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-9 text-xs">
                                    <SelectValue placeholder="Select interest" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FINANCIAL_SERVICES.map((s) => (
                                    <SelectItem key={s.id} value={s.title}>
                                      {s.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-[10px]" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-10 text-xs font-semibold shadow-xs gap-1.5"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <span>Get Started with Finora</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
