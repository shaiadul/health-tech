import Link from "next/link"
import { ServiceService } from "@/features/services/services/service.service"
import { MarketingNavbar } from "@/components/marketing/navbar"
import { MarketingFooter } from "@/components/marketing/footer"
import { ArrowRight, ArrowUpRight, Clock, ShieldCheck, Activity } from "lucide-react"

export const metadata = {
  title: "Clinical Medical Departments | MedPulse Hospital",
  description: "Browse specialized hospital departments: Cardiology, Pediatrics, Neurology, Orthopedics, Internal Medicine, and Dermatology.",
}

export default async function ServicesPage() {
  const services = await ServiceService.getAll()

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MarketingNavbar />
      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
          
          {/* Editorial Catalog Header */}
          <div className="max-w-3xl space-y-4 border-b border-border pb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Medical Specializations
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
              Hospital departments & <br />
              <span className="text-primary italic font-serif font-normal">clinical care</span>.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Every outpatient clinic is staffed by board-certified attending medical doctors providing comprehensive diagnostic assessments, advanced treatments, and compassionate patient care.
            </p>
          </div>

          {/* Large Numbered Editorial Service Rows (No Cards) */}
          <div className="divide-y divide-border border-b border-border">
            {services.map((srv, index) => {
              const indexFormatted = String(index + 1).padStart(2, "0")

              return (
                <div
                  key={srv.id}
                  className="py-12 flex flex-col lg:flex-row lg:items-start justify-between gap-8 hover:bg-muted/20 px-2 sm:px-4 transition-colors group"
                >
                  {/* Left: Number + Title + Description */}
                  <div className="flex items-start gap-6 sm:gap-10 max-w-2xl">
                    <span className="text-xl sm:text-2xl font-mono text-muted-foreground group-hover:text-primary transition-colors">
                      {indexFormatted}
                    </span>

                    <div className="space-y-4">
                      <div>
                        <Link
                          href={`/services/${srv.slug}`}
                          className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors inline-flex items-center gap-2"
                        >
                          <span>{srv.title}</span>
                          <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-primary" />
                        </Link>
                        <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
                          {srv.shortDescription}
                        </p>
                      </div>

                      {/* Benefits bullets */}
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground pt-2">
                        {srv.benefits.slice(0, 2).map((benefit, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right: Meta & Direct Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 pl-12 lg:pl-0 font-mono text-xs">
                    <div className="lg:text-right space-y-1">
                      <span className="block text-foreground font-semibold">
                        {srv.durationMinutes} min consultation
                      </span>
                      <span className="block text-primary">
                        {srv.feeDisplay}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      <Link
                        href={`/services/${srv.slug}`}
                        className="text-xs font-semibold text-muted-foreground hover:text-foreground underline underline-offset-4"
                      >
                        Clinical details
                      </Link>

                      <Link
                        href={`/book?service=${srv.id}`}
                        className="text-xs font-semibold uppercase tracking-wider px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                      >
                        Book Visit →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom Trust Assurance */}
          <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground border-b border-border">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Full accreditation by Joint Commission on Healthcare Accreditation</span>
            </div>
            <span>24/7 Hospital Emergency Triage Active On Campus</span>
          </div>

        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
