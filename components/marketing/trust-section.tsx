import * as React from "react"

export function TrustSection() {
  const metrics = [
    { value: "25K+", label: "Patients Treated" },
    { value: "99.4%", label: "Clinical Satisfaction" },
    { value: "40+", label: "Board-Certified MDs" },
    { value: "15+", label: "Years Hospital Excellence" },
  ]

  return (
    <section className="py-20 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Editorial Headline */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Clinical Excellence & Accreditation
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug">
              Trusted by patients <br />
              who demand uncompromised medical care.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every doctor at MedPulse holds board certification and subspecialty fellowship credentials. From acute care to preventive wellness, your health is our sole priority.
            </p>
          </div>

          {/* Horizontal Numbers Strip with Subtle Separators (No Cards) */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-border">
              {metrics.map((metric, idx) => (
                <div
                  key={metric.label}
                  className={`pt-6 sm:pt-0 ${idx !== 0 ? "sm:pl-6" : ""}`}
                >
                  <p className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground font-mono">
                    {metric.value}
                  </p>
                  <p className="text-xs uppercase font-mono tracking-wider text-muted-foreground mt-2">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
