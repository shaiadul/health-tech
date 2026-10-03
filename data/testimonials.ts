import { Testimonial } from "@/types/lead"

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test_01",
    clientName: "David Thornton",
    clientRole: "VP of Engineering at CloudScale",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    serviceName: "Investment Planning",
    rating: 5,
    quote:
      "The consultation helped me understand my equity compensation and diversification options much more clearly. Sarah modeled different tax scenarios in 45 minutes that saved me tens of thousands.",
    outcomeHighlight: "+14.2% Net Portfolio Alpha",
  },
  {
    id: "test_02",
    clientName: "Nadia Rahman",
    clientRole: "Founder & CEO, Studio Bloom",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    serviceName: "Business Finance & Treasury",
    rating: 5,
    quote:
      "As a non-finance founder, managing our operating cashflow was terrifying. Finora's team restructured our idle checking funds into high-yield reserves, generating an extra $3,500/month risk-free.",
    outcomeHighlight: "৳42,500/mo Added Treasury Yield",
  },
  {
    id: "test_03",
    clientName: "Robert Sterling",
    clientRole: "Senior Medical Consultant",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    serviceName: "Retirement Planning",
    rating: 5,
    quote:
      "Priya's Monte Carlo simulations gave my spouse and me total confidence in our early retirement timeline. Clear, non-salesy fiduciary advice is rare. Finora nailed it.",
    outcomeHighlight: "Retired 4 Years Ahead of Schedule",
  },
]
