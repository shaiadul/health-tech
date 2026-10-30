import { Testimonial } from "@/types/lead"

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test_01",
    clientName: "Eleanor Vance",
    clientRole: "Cardiology Patient · London",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    serviceName: "Cardiology & Heart Health",
    rating: 5,
    quote:
      "Dr. Sarah Ahmed detected my irregular arrhythmia during our initial in-clinic ECG checkup. Her immediate intervention and calm guidance prevented what could have been a serious cardiac event.",
    outcomeHighlight: "Blood Pressure Normalized (120/78)",
  },
  {
    id: "test_02",
    clientName: "Marcus Sterling",
    clientRole: "Parent of Pediatric Patient",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    serviceName: "Pediatrics & Child Wellness",
    rating: 5,
    quote:
      "Dr. Elena Rostova treated our 4-year-old with exceptional warmth and clinical precision. The booking process took 30 seconds on my phone, and the clinic wait time was under 5 minutes.",
    outcomeHighlight: "Resolved Acute Pediatric Respiratory Infection",
  },
  {
    id: "test_03",
    clientName: "David Thornton",
    clientRole: "Marathon Athlete",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    serviceName: "Orthopedics & Sports Medicine",
    rating: 5,
    quote:
      "Dr. David Kim designed an accelerated, non-surgical physical rehabilitation protocol for my torn knee meniscus. I was back running within 8 weeks with complete stability.",
    outcomeHighlight: "Full Range-of-Motion Restored",
  },
]
