import * as React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, Users, Calendar, Video, ArrowRight } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Tell Us About Your Goals",
      desc: "Select your financial objective — whether optimizing a stock portfolio, early retirement, or reducing business tax drag.",
      icon: Target,
    },
    {
      num: "02",
      title: "Choose a Vetted Specialist",
      desc: "Browse certified CFA®, CFP®, or CPA specialists based on verified client ratings, years in practice, and specialized focus.",
      icon: Users,
    },
    {
      num: "03",
      title: "Pick a Convenient Time",
      desc: "Select from morning, afternoon, or evening video and phone appointments with real-time calendar availability synchronization.",
      icon: Calendar,
    },
    {
      num: "04",
      title: "Attend Your Consultation",
      desc: "Join a secure 1-on-1 session to receive unbiased fiduciary recommendations and a tailored action roadmap.",
      icon: Video,
    },
  ]

  return (
    <section id="how-it-works" className="py-16 md:py-24 border-t border-border/60 bg-muted/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/20">
            Frictionless Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            How It Works
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            From discovering the right advisory focus to sitting down with an expert in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.num}
                className="p-6 rounded-2xl border border-border/80 bg-card shadow-2xs relative flex flex-col justify-between hover:border-border transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-primary/40">
                      {s.num}
                    </span>
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border/50 text-[11px] font-mono text-primary font-semibold">
                  Step {s.num} of 04
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" className="text-xs h-11 px-7 shadow-xs">
            <Link href="/book">
              <span>Start Your Step 01</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
