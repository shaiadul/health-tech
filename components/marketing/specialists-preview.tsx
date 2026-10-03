"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Clock, Star } from "lucide-react"
import { SPECIALISTS } from "@/data/specialists"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "./section-heading"

export function SpecialistsPreview() {
  const featured = SPECIALISTS.slice(0, 4)

  return (
    <section id="doctors" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Our doctors"
            title="Meet specialists you can trust"
            description="Board-certified, fellowship-trained and rated by thousands of patients."
          />
          <Link
            href="/specialists"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all shrink-0"
          >
            See all 40+ doctors <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((d, i) => (
            <motion.article
              key={d.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="relative aspect-[4/4.2] overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.avatar}
                  alt={d.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute left-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-900">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {d.rating}
                  <span className="font-normal text-slate-500">({d.reviewCount})</span>
                </span>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold leading-tight">{d.name}</h3>
                  <p className="text-sm text-primary mt-0.5">{d.title}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{d.experienceYears} yrs experience</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                    <Clock className="h-3.5 w-3.5" /> {d.nextAvailableSlot}
                  </span>
                </div>

                <Button asChild className="w-full h-10 gap-2">
                  <Link href={`/book?specialist=${d.id}`}>
                    Book appointment <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
