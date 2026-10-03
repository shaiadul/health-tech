import Link from "next/link"
import { SpecialistService } from "@/features/specialists/services/specialist.service"
import { MarketingNavbar } from "@/components/marketing/navbar"
import { MarketingFooter } from "@/components/marketing/footer"
import { Star, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Fiduciary Specialists Directory | Finora",
  description: "Browse certified CFA®, CFP®, and CPA financial advisors with verified ratings and instant availability.",
}

export default async function SpecialistsPage() {
  const specialists = await SpecialistService.getAll()

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MarketingNavbar />
      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
          
          {/* Editorial Header */}
          <div className="max-w-3xl space-y-4 border-b border-border pb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Practitioner Directory
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
              Fiduciary specialists. <br />
              <span className="text-primary italic font-serif font-normal">Direct access</span> to expertise.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Every advisor on our platform is legally bound to act in your best interest. Browse by practice area, credentials, and schedule private advisory sessions.
            </p>
          </div>

          {/* Clean Editorial Specialists List (No Cards) */}
          <div className="divide-y divide-border border-b border-border">
            {specialists.map((sp) => (
              <div
                key={sp.id}
                className="py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:bg-muted/20 px-2 sm:px-4 transition-colors group"
              >
                {/* Advisor Info */}
                <div className="space-y-3 max-w-2xl">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {sp.name}
                    </h2>
                    <p className="text-sm font-medium text-foreground/85 mt-0.5">
                      {sp.title} · <span className="text-muted-foreground">{sp.role}</span>
                    </p>
                  </div>

                  <p className="text-xs font-mono text-primary font-semibold">
                    {sp.specialties.join(" • ")}
                  </p>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {sp.bio}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono text-muted-foreground">
                    {sp.credentials.map((cred, idx) => (
                      <span key={idx} className="border border-border px-2 py-0.5">
                        {cred}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics & Direct Booking Action */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-6 font-mono text-xs">
                  <div className="flex items-center gap-8 lg:text-right">
                    <div>
                      <span className="block text-foreground font-semibold text-sm">
                        {sp.experienceYears} years
                      </span>
                      <span className="text-muted-foreground">experience</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 text-foreground font-semibold text-sm lg:justify-end">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span>{sp.rating}</span>
                      </div>
                      <span className="text-muted-foreground">({sp.reviewCount} reviews)</span>
                    </div>
                  </div>

                  <div className="space-y-2 lg:text-right">
                    <span className="block text-[11px] text-muted-foreground">
                      Next available: <strong className="text-primary">{sp.nextAvailableSlot}</strong>
                    </span>

                    <Link
                      href={`/book?specialist=${sp.id}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                    >
                      <span>Book Consultation</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
