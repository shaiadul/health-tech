import * as React from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

export function MarketingFooter() {
  const footerLinks = {
    solutions: [
      { name: "Investment Planning", href: "/services/investment-planning" },
      { name: "Personal Finance", href: "/services/personal-finance" },
      { name: "Business Finance", href: "/services/business-finance" },
      { name: "Tax Consultation", href: "/services/tax-consultation" },
      { name: "Retirement Planning", href: "/services/retirement-planning" },
      { name: "Financial Health Check", href: "/services/financial-health-check" },
    ],
    company: [
      { name: "Fiduciary Standards", href: "/#how-it-works" },
      { name: "Advisory Specialists", href: "/specialists" },
      { name: "Client Stories", href: "/#reviews" },
      { name: "Institutional Treasury", href: "/dashboard" },
    ],
    resources: [
      { name: "Perspectives & Insights", href: "/#insights" },
      { name: "FAQ", href: "/#faq" },
      { name: "Client Portal", href: "/portal" },
      { name: "Book Consultation", href: "/book" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Engagement", href: "#" },
      { name: "Form ADV Part 2A", href: "#" },
      { name: "Fiduciary Disclosure", href: "#" },
    ],
  }

  return (
    <footer className="border-t border-border bg-background text-foreground">
      {/* Large Spacious CTA Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-28 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Begin Your Engagement
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
              Let’s make your next <br />
              <span className="text-primary italic font-serif font-normal">financial decision</span> clearer.
            </h2>
          </div>

          <div>
            <Link
              href="/book"
              className="inline-flex items-center gap-3 text-lg sm:text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors pb-2 border-b-2 border-foreground hover:border-primary group"
            >
              <span>Book a consultation</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Directory Links (Spacious Editorial Grid) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-12">
          
          {/* Brand Intro */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-foreground">
                Finora
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Independent fiduciary advisory and financial consultations. Unbiased guidance designed around your lifecycle objectives.
            </p>
            <p className="text-[11px] font-mono text-muted-foreground">
              Member Fiduciary Advisory Alliance.
            </p>
          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              {footerLinks.solutions.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              {footerLinks.resources.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              {footerLinks.legal.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimers */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <p>© 2026 Finora Advisory Platform. Fictional demo environment.</p>
          <p>Strictly informational. Does not constitute real financial or banking services.</p>
        </div>
      </div>
    </footer>
  )
}
