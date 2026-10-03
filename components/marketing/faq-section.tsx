import * as React from "react"
import { FAQS } from "@/data/faqs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQSection() {
  return (
    <section id="faq" className="py-24 md:py-32 border-b border-border bg-background">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="space-y-3 pb-16 border-b border-border">
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            Common Inquiries
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Frequently asked questions.
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
            Everything you need to know about our fiduciary standard, scheduling flexibility, and meeting preparations.
          </p>
        </div>

        {/* Minimal Accordion (Zero Cards) */}
        <div className="pt-4">
          <Accordion type="single" collapsible className="w-full divide-y divide-border">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-b-0 py-2">
                <AccordionTrigger className="text-left text-lg sm:text-xl font-bold text-foreground hover:text-primary hover:no-underline py-5 transition-colors">
                  <span>{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed pb-6 max-w-2xl font-normal">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>
    </section>
  )
}
