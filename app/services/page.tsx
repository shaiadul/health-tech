import Link from "next/link"
import { ServiceService } from "@/features/services/services/service.service"
import { MarketingNavbar } from "@/components/marketing/navbar"
import { MarketingFooter } from "@/components/marketing/footer"
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
  CheckCircle2,
} from "lucide-react"

const ICONS: Record<string, React.ElementType> = {
  TrendingUp,
  Wallet,
  ShieldAlert,
  Receipt,
  Briefcase,
  ShieldCheck,
  Activity,
}

export const metadata = {
  title: "Financial Advisory Services | Finora",
  description: "Explore all fiduciary consultation services: Investment, Tax, Retirement, and Business Treasury.",
}

export default async function ServicesPage() {
  const services = await ServiceService.getAll()

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MarketingNavbar />
      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/20">
              Advisory Catalog
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Comprehensive Financial Services
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every consultation is led by a vetted CFP®, CFA, or CPA adhering to strict fiduciary standards with zero sales incentives.
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv) => {
              const Icon = ICONS[srv.iconName] || TrendingUp
              return (
                <Card
                  key={srv.id}
                  className="border border-border/80 hover:border-primary/50 transition-all bg-card flex flex-col justify-between group shadow-2xs"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {srv.feeDisplay}
                      </Badge>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {srv.title}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        {srv.shortDescription}
                      </p>
                    </div>

                    {/* Benefits Preview */}
                    <div className="space-y-1.5 pt-2 border-t border-border/50">
                      {srv.benefits.slice(0, 2).map((b, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{b}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <div className="p-5 pt-0 border-t border-border/40 flex items-center justify-between gap-2">
                    <Link
                      href={`/services/${srv.slug}`}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      <span>Full Details</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    <Button asChild size="sm" className="text-xs h-8">
                      <Link href={`/book?service=${srv.id}`}>Book Time</Link>
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
