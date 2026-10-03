import { MarketingNavbar } from "@/components/marketing/navbar"
import { MarketingHero } from "@/components/marketing/hero"
import { TrustSection } from "@/components/marketing/trust-section"
import { ServicesGrid } from "@/components/marketing/services-grid"
import { FeaturedConsultation } from "@/components/marketing/featured-consultation"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { SpecialistsPreview } from "@/components/marketing/specialists-preview"
import { InsightsSection } from "@/components/marketing/insights-section"
import { LeadCaptureSection } from "@/components/marketing/lead-capture"
import { TestimonialsSection } from "@/components/marketing/testimonials-section"
import { FAQSection } from "@/components/marketing/faq-section"
import { MarketingFooter } from "@/components/marketing/footer"

export const metadata = {
  title: "Finora — Financial Decisions, Made Simpler | Fiduciary Consultations",
  description:
    "Personalized financial guidance, portfolio audit, tax optimization and appointment booking with certified fiduciary specialists.",
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/10 selection:text-primary">
      <MarketingNavbar />
      <main className="flex-1">
        <MarketingHero />
        <TrustSection />
        <ServicesGrid />
        <FeaturedConsultation />
        <HowItWorks />
        <SpecialistsPreview />
        <InsightsSection />
        <LeadCaptureSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <MarketingFooter />
    </div>
  )
}
