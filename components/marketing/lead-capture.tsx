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
    <section className="py-24 md:py-32 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Clinical Statement */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Clinical Triage & Patient Guidance
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.08]">
              Quality medical care <br />
              should never feel complicated.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Have questions about your symptoms or medical test preparations? Leave your contact info and our clinical nursing triage team will reach out with preliminary guidance.
            </p>
          </div>

          {/* Right: Clean Editorial Lead Capture Form */}
          <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-border pt-8 lg:pt-0 lg:pl-16 space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Need clinical guidance or doctor matching?
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Receive doctor recommendation and preparation guidelines.
              </p>
            </div>

            {success ? (
              <div className="py-8 space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                  <span className="font-bold text-lg text-foreground">Request received.</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A triage coordinator will review your inquiry and follow up with specialist doctor recommendations.
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
                              placeholder="Patient full name"
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
                              placeholder="Patient email address"
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
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Get Clinical Guidance</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-[11px] font-mono text-muted-foreground">
                    Strict HIPAA & medical confidentiality. Your information is protected by hospital clinical security protocols.
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
