"use client"

import * as React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ShieldCheck, ArrowRight, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { newsletterSchema, NewsletterFormValues } from "@/features/leads/schemas/lead.schema"
import { LeadService } from "@/features/leads/services/lead.service"

export function MarketingFooter() {
  const [subscribed, setSubscribed] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: NewsletterFormValues) => {
    setLoading(true)
    await LeadService.subscribeNewsletter(values.email)
    setLoading(false)
    setSubscribed(true)
    form.reset()
  }

  return (
    <footer className="border-t border-border/80 bg-card text-card-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground">
                Finora
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Empowering individuals and enterprises to make confident, unbiased financial decisions through personalized fiduciary consultations and institutional-grade analytics.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-foreground mb-2">
                Get smarter financial insights delivered to your inbox
              </p>
              {subscribed ? (
                <div className="flex items-center gap-1.5 text-xs text-success font-medium">
                  <Check className="h-4 w-4" />
                  <span>Subscribed! Look out for our weekly briefing.</span>
                </div>
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex items-center gap-2 max-w-sm"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex-1 space-y-0">
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter work email"
                              className="h-9 text-xs"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" size="sm" disabled={loading} className="h-9 text-xs shrink-0">
                      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Subscribe"}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </div>

          {/* Column 1: Financial Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Services
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/services/investment-planning" className="hover:text-foreground transition-colors">
                  Investment Planning
                </Link>
              </li>
              <li>
                <Link href="/services/retirement-planning" className="hover:text-foreground transition-colors">
                  Retirement Strategies
                </Link>
              </li>
              <li>
                <Link href="/services/tax-consultation" className="hover:text-foreground transition-colors">
                  Tax Optimization
                </Link>
              </li>
              <li>
                <Link href="/services/business-finance" className="hover:text-foreground transition-colors">
                  Business Treasury
                </Link>
              </li>
              <li>
                <Link href="/services/financial-health-check" className="hover:text-foreground transition-colors">
                  Financial Health Diagnostic
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform & Appointments */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Scheduling
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/book" className="hover:text-foreground transition-colors font-medium text-primary">
                  Book a Consultation
                </Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-foreground transition-colors">
                  Manage Appointments
                </Link>
              </li>
              <li>
                <Link href="/#specialists" className="hover:text-foreground transition-colors">
                  Fiduciary Specialists
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-foreground transition-colors">
                  How Consultation Works
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-foreground transition-colors">
                  Client FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Institutional & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Governance & Security
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-1.5 text-foreground font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                <span>SOC-2 Certified</span>
              </li>
              <li>256-Bit TLS 1.3 Protocol</li>
              <li>100% Fiduciary Standard</li>
              <li>Zero Sales Commissions</li>
              <li>
                <Link href="/dashboard" className="text-primary hover:underline font-mono text-[11px]">
                  Institutional Portal →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar & disclaimer */}
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <p>© {new Date().getFullYear()} Finora Technologies Inc. All rights reserved.</p>
          <p className="max-w-md text-center sm:text-right">
            Finora is a simulated fiduciary advisory demonstration platform. Fictional data is utilized for client confidentiality and mock experience.
          </p>
        </div>
      </div>
    </footer>
  )
}
