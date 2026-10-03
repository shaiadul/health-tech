import * as React from "react"
import Link from "next/link"
import { FINANCIAL_SERVICES } from "@/data/services"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  Wallet,
  ShieldAlert,
  Receipt,
  Briefcase,
  ShieldCheck,
  Activity,
  ArrowRight,
  Clock,
} from "lucide-react"

// Map icon names to Lucide components
const ICONS: Record<string, React.ElementType> = {
  TrendingUp,
  Wallet,
  ShieldAlert,
  Receipt,
  Briefcase,
  ShieldCheck,
  Activity,
}

export function ServicesGrid() {
  return (
    <section id="services" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
        <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/20">
          Financial Solutions
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Tailored Fiduciary Services for Every Stage
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          From first-time wealth building to complex corporate treasury and retirement distributions, select the exact guidance you need.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FINANCIAL_SERVICES.map((srv) => {
          const Icon = ICONS[srv.iconName] || TrendingUp
          return (
            <Card
              key={srv.id}
              className="border border-border/80 hover:border-primary/50 transition-all hover:shadow-md bg-card flex flex-col justify-between group"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  {srv.badge && (
                    <Badge variant={srv.popular ? "default" : "outline"} className="text-[10px]">
                      {srv.badge}
                    </Badge>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {srv.shortDescription}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="h-3.5 w-3.5" />
                    {srv.durationMinutes} mins
                  </span>
                  <span className="font-semibold text-foreground">
                    {srv.feeDisplay}
                  </span>
                </div>
              </CardContent>

              {/* Bottom Card Actions */}
              <div className="p-4 pt-0 flex items-center justify-between gap-2">
                <Link
                  href={`/services/${srv.slug}`}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Explore Service</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Button asChild size="xs" variant="outline" className="text-xs h-7">
                  <Link href={`/book?service=${srv.id}`}>Book Time</Link>
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="mt-10 text-center">
        <Button asChild size="lg" className="text-xs h-10 px-6 font-semibold">
          <Link href="/book">
            <span>Schedule Full Financial Audit</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
