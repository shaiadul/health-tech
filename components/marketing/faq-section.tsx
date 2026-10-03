import * as React from "react"
import { FAQS } from "@/data/faqs"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

export function FAQSection() {
  return (
    <section id="faq" className="py-16 md:py-24 border-t border-border/60 bg-muted/15">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
          <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/20">
            Frequently Asked Questions
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Clear Answers, Zero Jargon
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Everything you need to know about our fiduciary consultations, remote meetings, and privacy protections.
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border/80 p-6 sm:p-8 shadow-xs">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                    <span>{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-6.5 text-muted-foreground leading-relaxed">
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
