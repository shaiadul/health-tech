import { notFound } from "next/navigation"
import Link from "next/link"
import { ServiceService } from "@/features/services/services/service.service"
import { SpecialistService } from "@/features/specialists/services/specialist.service"
import { MarketingNavbar } from "@/components/marketing/navbar"
import { MarketingFooter } from "@/components/marketing/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Star,
  FileCheck2,
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
    title: `${service.title} | Finora Consultation`,
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

      <main className="flex-1 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Breadcrumb & Hero */}
          <div className="space-y-6">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/services" className="hover:text-foreground">Services</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">{service.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/20">
                    Fiduciary Advisory
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {service.feeDisplay}
                  </Badge>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                  {service.title}
                </h1>

                <p className="text-base text-muted-foreground leading-relaxed max-w-2xl font-normal">
                  {service.fullDescription}
                </p>

                <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{service.durationMinutes} Minutes Consultation</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <ShieldCheck className="h-4 w-4 text-success" />
                    <span>100% Fiduciary Standard</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <FileCheck2 className="h-4 w-4 text-info" />
                    <span>Written Strategy Document Included</span>
                  </div>
                </div>
              </div>

              {/* Sticky Booking CTA Card */}
              <div className="lg:col-span-4">
                <Card className="border border-border/80 shadow-lg bg-card/90 backdrop-blur-md p-6 space-y-5">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground font-mono">Next Available Slot</span>
                    <p className="text-lg font-bold text-foreground">Today at 4:30 PM</p>
                    <p className="text-[11px] text-success font-medium">Free Initial Consultation</p>
                  </div>

                  <div className="space-y-2 text-xs text-muted-foreground border-y border-border/60 py-3">
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <strong className="text-foreground">HD Video or Phone</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <strong className="text-foreground">{service.durationMinutes} Minutes</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Specialist:</span>
                      <strong className="text-foreground">CFA / CFP Certified</strong>
                    </div>
                  </div>

                  <Button asChild size="lg" className="w-full text-xs h-11 font-semibold shadow-xs">
                    <Link href={`/book?service=${service.id}`}>
                      <span>Book Consultation Now</span>
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </Card>
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="space-y-6 pt-6 border-t border-border/60">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Strategic Benefits</h2>
              <p className="text-xs text-muted-foreground">What you gain from your fiduciary advisory session</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-border/70 bg-card flex items-start gap-3 shadow-2xs"
                >
                  <div className="h-6 w-6 rounded-md bg-success/15 text-success flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground leading-relaxed">
                      {benefit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4-Step Consultation Process */}
          <div className="space-y-6 pt-6 border-t border-border/60">
            <div>
              <h2 className="text-2xl font-bold text-foreground">How the Process Works</h2>
              <p className="text-xs text-muted-foreground">Step-by-step roadmap from booking to strategy implementation</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {service.process.map((step) => (
                <div
                  key={step.step}
                  className="p-5 rounded-xl border border-border/70 bg-card space-y-2 flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <span className="text-xs font-mono font-bold text-primary">
                      Phase {step.step}
                    </span>
                    <h3 className="text-sm font-bold text-foreground mt-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements Checklist */}
          <div className="space-y-4 pt-6 border-t border-border/60">
            <h2 className="text-xl font-bold text-foreground">What to Prepare Before Your Call</h2>
            <div className="p-5 rounded-xl border border-border/80 bg-muted/20 space-y-2.5">
              {service.requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Specialists for this service */}
          <div className="space-y-6 pt-6 border-t border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Available Specialists for this Service</h2>
                <p className="text-xs text-muted-foreground">Select an advisor specializing in {service.title}</p>
              </div>
              <Button asChild variant="outline" size="sm" className="text-xs h-8">
                <Link href="/specialists">View All</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displaySpecialists.slice(0, 3).map((sp) => (
                <Card key={sp.id} className="border border-border/80 bg-card p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border border-border">
                      <AvatarImage src={sp.avatar} alt={sp.name} />
                      <AvatarFallback>{sp.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{sp.name}</h4>
                      <p className="text-[11px] text-primary">{sp.title}</p>
                      <div className="flex items-center gap-1 text-[10px] text-amber-500 font-mono mt-0.5">
                        <Star className="h-3 w-3 fill-current" />
                        <span>{sp.rating} ({sp.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{sp.bio}</p>
                  <Button asChild size="xs" className="w-full text-xs h-7 mt-2">
                    <Link href={`/book?service=${service.id}&specialist=${sp.id}`}>
                      Book with {sp.name.split(" ")[0]}
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Service FAQ */}
          {service.faqs.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-border/60">
              <h2 className="text-2xl font-bold text-foreground">Service FAQs</h2>
              <div className="bg-card rounded-xl border border-border/80 p-5">
                <Accordion type="single" collapsible className="w-full">
                  {service.faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq_${i}`}>
                      <AccordionTrigger className="text-xs sm:text-sm font-semibold text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          )}
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
