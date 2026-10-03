import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function FeaturedConsultation() {
  return (
    <section className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Thoughtful Editorial Prompt */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Introductory Guidance
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.08]">
              Not sure where <br />
              to start?
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Talk to a financial specialist and get clarity around your next move. Whether reviewing existing accounts or navigating complex business decisions, we provide unbiased fiduciary perspective.
            </p>
          </div>

          {/* Right: Large Editorial Teal CTA Area (Full Area, Not a standard shadow card) */}
          <div className="lg:col-span-6">
            <div className="bg-primary text-primary-foreground p-10 sm:p-14 space-y-6 relative overflow-hidden">
              <span className="text-xs font-mono uppercase tracking-widest text-primary-foreground/80 block">
                30 Min Consultation
              </span>

              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary-foreground leading-snug">
                One conversation can redefine your long-term capital trajectory.
              </h3>

              <div className="pt-2">
                <Link
                  href="/book"
                  className="inline-flex items-center gap-3 text-base font-semibold tracking-tight text-primary-foreground border-b-2 border-primary-foreground pb-1 hover:opacity-85 transition-opacity group"
                >
                  <span>Book your time</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>

              <p className="text-xs font-mono text-primary-foreground/75 pt-4 border-t border-primary-foreground/20">
                No complicated process. No product sales. Just an honest conversation.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
