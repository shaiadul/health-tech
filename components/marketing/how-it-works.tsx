import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Select Department or Symptom",
      description:
        "Choose your clinical area of concern—Cardiology, Pediatrics, Orthopedics, Neurology, Internal Medicine, or a General Health Check.",
    },
    {
      step: "02",
      title: "Choose Attending Physician",
      description:
        "Review board-certified medical doctors, subspecialty fellowship credentials, experience, and verified patient reviews.",
    },
    {
      step: "03",
      title: "Pick In-Clinic or Telehealth Time",
      description:
        "Select an immediate or upcoming opening for an in-person hospital suite visit or an encrypted HD video telehealth consultation.",
    },
    {
      step: "04",
      title: "Receive Treatment & E-Prescription",
      description:
        "Consult directly with your physician, receive your diagnostic plan, and access certified digital prescriptions in your Patient Portal.",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 md:py-32 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-3 pb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            Patient Journey
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            How it works.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A frictionless, patient-first process designed to connect you with specialist medical care without tedious paperwork or clinic delays.
          </p>
        </div>

        {/* Storytelling Layout with Large Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 divide-y lg:divide-y-0 divide-border">
          {steps.map((item, idx) => (
            <div key={item.step} className={`${idx !== 0 ? "pt-8 lg:pt-0" : ""} space-y-4`}>
              <div className="text-5xl sm:text-6xl font-bold font-mono text-primary/70 tracking-tighter">
                {item.step}
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Minimal inline conversion trigger */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-xs font-mono text-muted-foreground">
            Emergency department & urgent trauma triage active 24/7 on hospital campus.
          </span>
          <Button
            asChild
            variant="link"
            className="p-0 h-auto text-xs font-semibold text-primary hover:text-primary/80 gap-1.5"
          >
            <Link href="/book">
              <span>Book your medical appointment now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  )
}
