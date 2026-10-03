import * as React from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { INSIGHTS } from "@/data/insights"

export function InsightsSection() {
  return (
    <section id="insights" className="py-24 md:py-32 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-16 border-b border-border">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Perspectives & Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Latest insights.
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            In-depth analysis on tax efficiency, market cycles, and capital deployment written directly by our advisory partners.
          </p>
        </div>

        {/* Editorial Insights List (No Cards) */}
        <div className="divide-y divide-border">
          {INSIGHTS.map((insight) => (
            <article
              key={insight.id}
              className="py-10 flex flex-col md:flex-row md:items-baseline justify-between gap-6 hover:bg-muted/20 px-2 sm:px-4 transition-colors group cursor-pointer"
            >
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                  <span className="text-primary font-semibold">{insight.category}</span>
                  <span>•</span>
                  <span>{insight.date}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {insight.title}
                </h3>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {insight.summary}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground md:self-center pl-0">
                <span>{insight.readTime}</span>
                <div className="h-8 w-8 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:text-primary transition-colors">
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
