import * as React from "react"
import Link from "next/link"
import {
  TrendingUp,
  ShieldCheck,
  Calendar,
  ArrowRight,
  Star,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-border/60 bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Subtle background ambient mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/80 text-xs text-muted-foreground shadow-2xs backdrop-blur-xs">
              <span className="flex h-2 w-2 rounded-full bg-success" />
              <span className="font-medium text-foreground">Fiduciary Standard</span>
              <span>•</span>
              <span>Zero Product Commissions</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline font-mono text-primary">25,000+ Consulted</span>
            </div>

            {/* Core Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Financial decisions, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/90 to-primary/70">
                made simpler.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Get personalized financial guidance, compare solutions, and book time with experts you can trust. No sales pitches, just actionable fiduciary advice.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Button asChild size="lg" className="w-full sm:w-auto h-12 px-7 text-sm font-semibold shadow-md bg-primary text-primary-foreground gap-2">
                <Link href="/book">
                  <Calendar className="h-4 w-4" />
                  <span>Book a Consultation</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-12 px-6 text-sm font-medium border-border">
                <Link href="/#services">
                  <span>Explore Services</span>
                </Link>
              </Button>
            </div>

            {/* Social Trust row */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-xs text-muted-foreground">
              <div className="flex -space-x-2">
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" />
                  <AvatarFallback>U1</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" />
                  <AvatarFallback>U2</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarImage src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" />
                  <AvatarFallback>U3</AvatarFallback>
                </Avatar>
                <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center font-bold text-[10px] text-foreground">
                  +15k
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-foreground">4.9/5</span>
                <span>(3,800+ Verified Client Reviews)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Modern Financial Dashboard Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md w-full">
              {/* Main Preview Container */}
              <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xl space-y-4">
                {/* Header preview */}
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Fiduciary Advisory Portal</h4>
                      <p className="text-[10px] text-muted-foreground">Live Financial Health Matrix</p>
                    </div>
                  </div>
                  <Badge variant="success" className="text-[10px] gap-1">
                    <ShieldCheck className="h-3 w-3" /> Active Fiduciary
                  </Badge>
                </div>

                {/* Dashboard Card 1: Portfolio Growth */}
                <div className="p-4 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Projected Portfolio</span>
                    <span className="text-2xl font-bold font-mono text-foreground">$482,500</span>
                    <div className="flex items-center gap-1 text-xs text-success font-semibold mt-0.5 font-mono">
                      <TrendingUp className="h-3 w-3" />
                      <span>+12.8% annual alpha</span>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-success/15 text-success flex items-center justify-center">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>

                {/* Dashboard Card 2: Monthly Savings */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20">
                    <span className="text-[10px] text-muted-foreground uppercase font-medium block">
                      Monthly Savings
                    </span>
                    <span className="text-lg font-bold font-mono text-foreground mt-0.5 block">
                      ৳42,500
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      ($3,500 / mo yield)
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20">
                    <span className="text-[10px] text-muted-foreground uppercase font-medium block">
                      Financial Health
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-lg font-bold text-success font-mono">94</span>
                      <span className="text-xs font-medium text-success">/100</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">Excellent Tier</span>
                  </div>
                </div>

                {/* Dashboard Card 3: Next Specialist Match */}
                <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-primary/20">
                      <AvatarImage src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" />
                      <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-bold text-foreground">Sarah Ahmed, CFA</p>
                      <p className="text-[10px] text-muted-foreground">Senior Wealth Advisor</p>
                      <span className="text-[10px] text-primary font-medium flex items-center gap-1 mt-0.5">
                        <Zap className="h-3 w-3" /> Next slot: Today, 4:30 PM
                      </span>
                    </div>
                  </div>
                  <Button asChild size="xs" className="h-7 text-xs px-2.5">
                    <Link href="/book?specialist=sp_sarah_01">Book</Link>
                  </Button>
                </div>
              </div>

              {/* Floating decorative badge */}
              <div className="absolute -bottom-4 -left-4 p-2.5 rounded-xl bg-card border border-border shadow-lg flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-[11px] font-semibold text-foreground">
                  30-Min Zero-Risk Strategy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
