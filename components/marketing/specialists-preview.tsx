import * as React from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Star } from "lucide-react"
import { SPECIALISTS } from "@/data/specialists"

export function SpecialistsPreview() {
  // Show top featured specialists
  const featured = SPECIALISTS.slice(0, 4)

  return (
    <section id="experts" className="py-24 md:py-32 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-16 border-b border-border">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Advisory Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Direct access to <br className="hidden sm:inline" />
              seasoned practitioners.
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            All Finora advisors are independent fiduciaries held to the highest standard of client care. Never compensated by mutual funds, annuities, or third-party products.
          </p>
        </div>

        {/* Clean Editorial Specialists List (No Cards) */}
        <div className="divide-y divide-border">
          {featured.map((specialist) => (
            <div
              key={specialist.id}
              className="py-8 sm:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-muted/30 px-2 sm:px-4 transition-colors group"
            >
              {/* Left Column: Name, Role, Specialties */}
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {specialist.name}
                  </h3>
                </div>

                <p className="text-sm font-medium text-foreground/80">
                  {specialist.title}
                </p>

                <p className="text-xs font-mono text-muted-foreground">
                  {specialist.specialties.join(" • ")}
                </p>
              </div>

              {/* Middle: Experience & Rating */}
              <div className="flex items-center gap-8 sm:gap-12 text-xs font-mono text-muted-foreground">
                <div>
                  <span className="block text-foreground font-semibold text-sm">
                    {specialist.experienceYears} years
                  </span>
                  <span>experience</span>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-foreground font-semibold text-sm">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    <span>{specialist.rating}</span>
                  </div>
                  <span>rating ({specialist.reviewCount})</span>
                </div>

                <div className="hidden lg:block text-right">
                  <span className="block text-primary font-medium">
                    {specialist.nextAvailableSlot}
                  </span>
                  <span>next opening</span>
                </div>
              </div>

              {/* Right: Select Action */}
              <div className="pt-2 md:pt-0">
                <Link
                  href={`/book?specialist=${specialist.id}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors pb-1 border-b border-border group-hover:border-primary"
                >
                  <span>Select</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Directory CTA */}
        <div className="pt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-mono text-muted-foreground">
            Looking for niche industry expertise like biotech exits or international cross-border estates?
          </span>
          <Link
            href="/specialists"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 group"
          >
            <span>View all advisory specialists</span>
            <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  )
}
