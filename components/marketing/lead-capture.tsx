"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { quickLeadSchema, QuickLeadFormValues } from "@/features/leads/schemas/lead.schema"
import { LeadService } from "@/features/leads/services/lead.service"
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react"

export function LeadCaptureSection() {
  const [success, setSuccess] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const form = useForm<QuickLeadFormValues>({
    resolver: zodResolver(quickLeadSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      serviceInterest: "Investment Planning",
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
    <section className="py-24 md:py-32 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Problem → Solution Editorial Statement */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              The Finora Standard
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.08]">
              Financial decisions <br />
              shouldn’t feel complicated.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Get guidance designed around your goals, not generic advice or commission-driven quotas. We translate complex balance sheets into actionable, verifiable execution steps.
            </p>
          </div>

          {/* Right: Clean Editorial Lead Capture Form (No Cards) */}
          <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-border pt-8 lg:pt-0 lg:pl-16 space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Want personalized financial guidance?
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Receive initial benchmarking notes before you schedule your call.
              </p>
            </div>

            {success ? (
              <div className="py-8 space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                  <span className="font-bold text-lg text-foreground">Inquiry received.</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A fiduciary specialist will review your request and send tailored consultation notes directly to your inbox.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSuccess(false)}
                  className="rounded-none text-xs"
                >
                  Submit Another Inquiry
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Your full name"
                              className="h-12 rounded-none border-border bg-background focus:border-primary text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Your email address"
                              type="email"
                              className="h-12 rounded-none border-border bg-background focus:border-primary text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto h-12 px-8 text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Get Started</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-[11px] font-mono text-muted-foreground">
                    Strict privacy. We never share your data or sell marketing lists.
                  </p>
                </form>
              </Form>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
