import * as React from "react"
import Link from "next/link"
import { Clock, PhoneCall } from "lucide-react"
import { FAQS } from "@/data/faqs"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SectionHeading } from "./section-heading"

export function FAQSection() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left: heading + help card */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="FAQ"
              title="Questions? We have answers"
              description="Everything about booking, insurance, video visits and what to expect on the day."
            />

            <div className="rounded-2xl border border-border bg-muted/40 p-6 space-y-4">
              <p className="font-semibold">Still need help?</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our care team replies within minutes during clinic hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="gap-2">
                  <Link href="tel:+18004325847">
                    <PhoneCall className="h-4 w-4" /> Call us
                  </Link>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <Link href="#get-guidance">
                    <Clock className="h-4 w-4 text-primary" /> Request a callback
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right: accordion */}
          <div className="lg:col-span-7">
            <Accordion type="single" collapsible defaultValue={FAQS[0]?.id} className="space-y-3">
              {FAQS.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="rounded-2xl border border-border bg-card px-5 data-[state=open]:border-primary/40 data-[state=open]:shadow-md data-[state=open]:shadow-primary/5 transition-all"
                >
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
