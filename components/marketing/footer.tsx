import * as React from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Activity } from "lucide-react"

export function MarketingFooter() {
  const footerLinks = {
    departments: [
      { name: "Cardiology & Heart Health", href: "/services/cardiology" },
      { name: "Neurology & Brain Health", href: "/services/neurology" },
      { name: "Pediatrics & Child Wellness", href: "/services/pediatrics" },
      { name: "Orthopedics & Sports Medicine", href: "/services/orthopedics" },
      { name: "General & Internal Medicine", href: "/services/internal-medicine" },
      { name: "Comprehensive Health Checkup", href: "/services/executive-health-check" },
    ],
    hospital: [
      { name: "Hospital Standards & Safety", href: "/#how-it-works" },
      { name: "Medical Staff & Physicians", href: "/specialists" },
      { name: "Patient Reviews", href: "/#reviews" },
      { name: "Emergency Triage Guidelines", href: "/#faq" },
    ],
    patients: [
      { name: "Medical Insights & Prevention", href: "/#insights" },
      { name: "Patient FAQs", href: "/#faq" },
      { name: "Patient Portal", href: "/portal" },
      { name: "Book Doctor Appointment", href: "/book" },
    ],
    legal: [
      { name: "HIPAA Patient Privacy", href: "#" },
      { name: "Patient Bill of Rights", href: "#" },
      { name: "Clinical Informed Consent", href: "#" },
      { name: "Medical Ethics Policy", href: "#" },
    ],
  }

  return (
    <footer className="border-t border-border bg-background text-foreground">
      {/* Large Spacious CTA Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-28 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Prioritize Your Health Today
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
              Experience medical care <br />
              <span className="text-primary italic font-serif font-normal">centered around you</span>.
            </h2>
          </div>

          <div>
            <Link
              href="/book"
              className="inline-flex items-center gap-3 text-lg sm:text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors pb-2 border-b-2 border-foreground hover:border-primary group"
            >
              <span>Schedule Doctor Visit</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Directory Links */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-12">
          
          {/* Brand Intro */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-sm bg-primary text-primary-foreground flex items-center justify-center font-bold">
                <Activity className="h-3.5 w-3.5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                MedPulse
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Accredited hospital medical center and clinical consultation suites. Providing multidisciplinary healthcare excellence.
            </p>
            <p className="text-[11px] font-mono text-primary font-semibold">
              Emergency Triage: 24/7 On Hospital Campus
            </p>
          </div>

          {/* Departments */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              Departments
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              {footerLinks.departments.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hospital */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              Hospital
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              {footerLinks.hospital.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Patients */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              Patients
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              {footerLinks.patients.map((item) => (
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
              Compliance
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
          <p>© 2026 MedPulse Clinic & Hospital System. All rights reserved.</p>
          <p>For immediate life-threatening medical emergencies, dial your local emergency services (911) immediately.</p>
        </div>
      </div>
    </footer>
  )
}
