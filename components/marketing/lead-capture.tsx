"use client"

import * as React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, CheckCircle2, Loader2, PhoneCall, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { quickLeadSchema, QuickLeadFormValues } from "@/features/leads/schemas/lead.schema"
import { LeadService } from "@/features/leads/services/lead.service"

const PERKS = [
  "Free callback from a registered nurse",
  "Matched with the right specialist",
  "Reply within 30 minutes in clinic hours",
]

export function LeadCaptureSection() {
  const [success, setSuccess] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const form = useForm<QuickLeadFormValues>({
    resolver: zodResolver(quickLeadSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      serviceInterest: "Cardiology & Heart Health",
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
    <section id="get-guidance" className="py-20 md:py-28 bg-background scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white">
          {/* decorative glow */}
          <div
            aria-hidden
            className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-teal-500/25 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl"
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 p-8 sm:p-12 lg:p-16 items-center">
            {/* Copy */}
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-teal-300">
                <span className="h-px w-6 bg-current" /> Free guidance
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                Not sure which doctor to see?
              </h2>
              <p className="text-white/70 leading-relaxed max-w-md">
                Leave your details and our care team will call you back with a personal recommendation, at no cost.
              </p>

              <ul className="space-y-3">
                {PERKS.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm text-white/85">
                    <CheckCircle2 className="h-5 w-5 text-teal-300 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>

              <Link
                href="tel:+18004325847"
                className="inline-flex items-center gap-2 text-sm font-semibold text-teal-300 hover:text-teal-200 transition-colors"
              >
                <PhoneCall className="h-4 w-4" /> Prefer to call? +1 (800) 432-5847
              </Link>
            </div>

            {/* Form card */}
            <div className="rounded-2xl bg-background text-foreground p-6 sm:p-8 shadow-2xl">
              {success ? (
                <div className="py-6 text-center space-y-4">
                  <span className="mx-auto h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="h-7 w-7" />
                  </span>
                  <h3 className="text-xl font-bold">Request received</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A member of our care team will contact you shortly with specialist recommendations.
                  </p>
                  <Button variant="outline" onClick={() => setSuccess(false)}>
                    Send another request
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold">Request a free callback</h3>
                  <p className="text-sm text-muted-foreground mt-1">Takes less than 20 seconds.</p>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Your full name" className="h-12" {...field} />
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
                              <Input type="email" placeholder="Email address" className="h-12" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={loading} className="w-full h-12 gap-2 text-sm font-semibold">
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                          </>
                        ) : (
                          <>
                            Get my free callback <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>

                      <p className="flex items-start gap-2 text-[11px] text-muted-foreground leading-relaxed">
                        <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                        Your information is confidential and protected under HIPAA.
                      </p>
                    </form>
                  </Form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
