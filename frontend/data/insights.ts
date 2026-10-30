export interface InsightItem {
  id: string
  title: string
  summary: string
  readTime: string
  category: string
  date: string
}

export const INSIGHTS: InsightItem[] = [
  {
    id: "insight-01",
    title: "Preventive Cardiology: The Silent Markers Before Symptoms Arise",
    summary: "Why standard blood pressure readings can overlook microvascular arterial stiffness, and how proactive calcium scoring protects lifelong heart function.",
    readTime: "5 min read",
    category: "Cardiovascular Health",
    date: "October 2026",
  },
  {
    id: "insight-02",
    title: "Joint Cartilage Restoration: Modern Alternatives to Invasive Surgery",
    summary: "Clinical evidence comparing ultrasound-guided regenerative therapies and kinetic physical rehabilitation for knee and shoulder mobility.",
    readTime: "6 min read",
    category: "Orthopedic Medicine",
    date: "September 2026",
  },
  {
    id: "insight-03",
    title: "Pediatric Immunization & Respiratory Wellness in Changing Seasons",
    summary: "Evidence-based pediatric guidelines for navigating seasonal viral flare-ups, ear infections, and school-age immunity booster schedules.",
    readTime: "4 min read",
    category: "Pediatric Care",
    date: "September 2026",
  },
  {
    id: "insight-04",
    title: "Metabolic Health & Biomarkers: Understanding Your Annual Blood Panel",
    summary: "Deciphering fasting insulin, high-sensitivity CRP, lipid sub-fractions, and thyroid panels to optimize daily energy and cellular longevity.",
    readTime: "7 min read",
    category: "Internal Medicine",
    date: "August 2026",
  },
]
