"use client"

import * as React from "react"
import { useInView } from "framer-motion"
import { Award, BadgeCheck, Lock, ShieldCheck } from "lucide-react"

const STATS = [
  { to: 25000, suffix: "+", decimals: 0, label: "Patients treated", note: "Across 7 departments" },
  { to: 99.4, suffix: "%", decimals: 1, label: "Patient satisfaction", note: "Verified post-visit surveys" },
  { to: 40, suffix: "+", decimals: 0, label: "Board-certified doctors", note: "Fellowship-trained specialists" },
  { to: 8, suffix: " min", decimals: 0, label: "Average wait time", note: "From check-in to consultation" },
]

const BADGES = [
  { icon: Award, text: "Joint Commission accredited" },
  { icon: Lock, text: "HIPAA-compliant records" },
  { icon: BadgeCheck, text: "Board-certified specialists" },
  { icon: ShieldCheck, text: "Major insurance accepted" },
]

function CountUp({ to, suffix, decimals }: { to: number; suffix: string; decimals: number }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [value, setValue] = React.useState(0)

  React.useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const duration = 1400
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      setValue(to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])

  return (
    <span ref={ref}>
      {value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

export function TrustSection() {
  return (
    <section className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 lg:divide-x lg:divide-white/10">
          {STATS.map((s, i) => (
            <div key={s.label} className={`px-2 lg:px-8 ${i === 0 ? "lg:pl-0" : ""}`}>
              <p className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                <CountUp to={s.to} suffix={s.suffix} decimals={s.decimals} />
              </p>
              <p className="mt-2 text-sm font-semibold text-teal-300">{s.label}</p>
              <p className="text-xs text-white/55 mt-0.5">{s.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-between gap-x-8 gap-y-4">
          {BADGES.map((b) => (
            <div key={b.text} className="flex items-center gap-2 text-sm text-white/75">
              <b.icon className="h-4 w-4 text-teal-300" />
              <span>{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
