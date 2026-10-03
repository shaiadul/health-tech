"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Clock } from "lucide-react"
import { INSIGHTS } from "@/data/insights"
import { SectionHeading } from "./section-heading"

const TINTS = [
  "from-teal-500/15 to-cyan-500/5",
  "from-sky-500/15 to-indigo-500/5",
  "from-emerald-500/15 to-teal-500/5",
]

export function InsightsSection() {
  const posts = INSIGHTS.slice(0, 3)

  return (
    <section id="insights" className="py-20 md:py-28 bg-muted/40 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          eyebrow="Health library"
          title="Advice from our doctors"
          description="Practical, evidence-based guidance on staying healthy, written by our attending physicians."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all"
            >
              <div className={`h-36 bg-gradient-to-br ${TINTS[i % TINTS.length]} p-5 flex items-end`}>
                <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-primary">
                  {p.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold leading-snug group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {p.summary}
                </p>

                <div className="mt-auto pt-5 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {p.readTime}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-primary">
                    Read article
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
