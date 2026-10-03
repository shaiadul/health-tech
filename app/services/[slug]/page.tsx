import { notFound } from "next/navigation"
import Link from "next/link"
import { ServiceService } from "@/features/services/services/service.service"
import { SpecialistService } from "@/features/specialists/services/specialist.service"
import { MarketingNavbar } from "@/components/marketing/navbar"
import { MarketingFooter } from "@/components/marketing/footer"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Clock,
  ShieldCheck,
  ArrowRight,
  Star,
  ChevronRight,
} from "lucide-react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = await ServiceService.getBySlug(slug)
  if (!service) return { title: "Service Not Found" }

  return {
    title: `${service.title} | MedPulse Hospital Clinic`,
    description: service.shortDescription,
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = await ServiceService.getBySlug(slug)

  if (!service) {
    notFound()
  }

  const specialists = await SpecialistService.getByServiceTitle(service.title)
  const displaySpecialists = specialists.length > 0 ? specialists : await SpecialistService.getFeatured()

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MarketingNavbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-20">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/services" className="hover:text-foreground">Services</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-semibold">{service.title}</span>
          </div>

          {/* Editorial Service Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start border-b border-border pb-16">
            <div className="lg:col-span-8 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold block">
                Fiduciary Practice Vertical
              </span>

              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
                {service.title}
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {service.fullDescription}
              </p>

              <div className="flex flex-wrap items-center gap-8 pt-4 text-xs font-mono text-muted-foreground border-t border-border">
                <div className="flex items-center gap-2 text-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{service.durationMinutes} min consultation</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Zero commissions guarantee</span>
                </div>
                <div>
                  <span className="text-primary font-semibold">{service.feeDisplay}</span>
                </div>
              </div>
            </div>

            {/* Direct Editorial CTA Area (No Boxed Shadow Card) */}
            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-border pt-8 lg:pt-0 lg:pl-10 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block">
                Immediate Scheduling
              </span>

              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground font-mono">
                  Today at 4:30 PM
                </p>
                <p className="text-xs text-primary font-semibold">
                  Next opening with senior advisor
                </p>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect via encrypted video or telephone. Receive a comprehensive diagnostic roadmap tailored to your asset profile.
              </p>

              <Button
                asChild
                className="w-full h-12 text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-2"
              >
                <Link href={`/book?service=${service.id}`}>
                  <span>Talk to an Expert →</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Benefits Section (Editorial List, No Cards) */}
          <section className="space-y-8 border-b border-border pb-16">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                Strategic Scope
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                What this consultation delivers.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {service.benefits.map((benefit, i) => (
                <div key={i} className="py-4 border-b border-border/80 flex items-start gap-4">
                  <span className="text-sm font-mono text-primary font-bold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-base text-foreground font-medium leading-relaxed">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 4-Phase Advisory Roadmap (Large Numbers, No Cards) */}
          <section className="space-y-8 border-b border-border pb-16">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                Execution Methodology
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                How it works.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4 divide-y lg:divide-y-0 divide-border">
              {service.process.map((step, idx) => (
                <div key={step.step} className={`${idx !== 0 ? "pt-6 lg:pt-0" : ""} space-y-3`}>
                  <div className="text-4xl sm:text-5xl font-mono font-bold text-primary/70">
                    0{step.step}
                  </div>
                  <h3 className="text-lg font-bold text-foreground pt-1 border-t border-border">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Requirements Checklist */}
          <section className="space-y-6 border-b border-border pb-16">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                Preparation
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                What to prepare before your session.
              </h2>
            </div>

            <div className="divide-y divide-border border-y border-border">
              {service.requirements.map((req, i) => (
                <div key={i} className="py-4 flex items-center gap-4 text-sm text-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Matched Specialists (Clean List, No Cards) */}
          <section className="space-y-8 border-b border-border pb-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                  Practice Specialists
                </span>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  Advisors specialized in {service.title}.
                </h2>
              </div>
              <Link
                href="/specialists"
                className="text-xs font-mono text-primary hover:underline"
              >
                View all advisors →
              </Link>
            </div>

            <div className="divide-y divide-border border-y border-border">
              {displaySpecialists.slice(0, 3).map((sp) => (
                <div
                  key={sp.id}
                  className="py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-muted/20 px-2 sm:px-4 transition-colors group"
                >
                  <div className="space-y-1 max-w-xl">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {sp.name}
                    </h3>
                    <p className="text-xs font-medium text-foreground/80">
                      {sp.title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                      {sp.bio}
                    </p>
                  </div>

                  <div className="flex items-center gap-8 text-xs font-mono text-muted-foreground">
                    <div className="flex items-center gap-1 text-foreground">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                      <span className="font-semibold">{sp.rating}</span>
                      <span>({sp.reviewCount})</span>
                    </div>

                    <Link
                      href={`/book?service=${service.id}&specialist=${sp.id}`}
                      className="text-xs font-semibold uppercase tracking-wider px-4 py-2 border border-border bg-background group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                    >
                      Select Advisor
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Service FAQ (Minimal Accordion, Zero Cards) */}
          {service.faqs.length > 0 && (
            <section className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                  Common Inquiries
                </span>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  Questions about {service.title}.
                </h2>
              </div>

              <div className="pt-4">
                <Accordion type="single" collapsible className="w-full divide-y divide-border">
                  {service.faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq_${i}`} className="border-b-0 py-2">
                      <AccordionTrigger className="text-left text-lg font-bold text-foreground hover:text-primary hover:no-underline py-5 transition-colors">
                        <span>{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed pb-6 max-w-2xl font-normal">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>
          )}

        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
