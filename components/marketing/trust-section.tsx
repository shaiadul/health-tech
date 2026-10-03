import * as React from "react"
import { ShieldCheck, Users, ThumbsUp, CalendarCheck2, Award, Lock } from "lucide-react"

export function TrustSection() {
  const stats = [
    {
      metric: "25K+",
      label: "Client Portfolios Advised",
      desc: "Individuals and founders trusting Finora",
      icon: Users,
    },
    {
      metric: "98%",
      label: "Customer Satisfaction",
      desc: "Verified 5-star consultation reviews",
      icon: ThumbsUp,
    },
    {
      metric: "15K+",
      label: "Consultations Completed",
      desc: "Across investment, tax and business",
      icon: CalendarCheck2,
    },
    {
      metric: "10+",
      label: "Years Average Experience",
      desc: "CFP®, CFA, and CPA credentialed advisors",
      icon: Award,
    },
  ]

  return (
    <section className="py-12 md:py-16 border-b border-border/60 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="p-5 rounded-xl border border-border/60 bg-card shadow-2xs space-y-2 hover:border-border transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-foreground">
                    {item.metric}
                  </span>
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">{item.label}</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Security & Fiduciary Trust Bar */}
        <div className="mt-8 p-4 rounded-xl border border-border/80 bg-card flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary shrink-0" />
            <span>
              <strong className="text-foreground">Bank-Grade Security:</strong> All financial consultations are encrypted end-to-end with 256-bit TLS protocol.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-success font-medium">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>100% Fee-Only Fiduciary Oath</span>
          </div>
        </div>
      </div>
    </section>
  )
}
