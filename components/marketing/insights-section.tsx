"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, BookOpen, Sparkles } from "lucide-react"
import { INSIGHTS } from "@/data/insights"
import { Badge } from "@/components/ui/badge"

export function InsightsSection() {
  return (
    <section id="insights" className="py-20 md:py-28 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-border">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
              Clinical Research & Patient Guidance
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Medical insights & preventative health.
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Evidence-based preventative research, longevity protocols, and diagnostic guides written directly by our board-certified attending physicians.
          </p>
        </div>

        {/* Dynamic Medical Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INSIGHTS.map((insight, idx) => (
            <motion.article
              key={insight.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="p-6 sm:p-7 border border-border bg-background hover:border-primary/50 transition-all group flex flex-col justify-between gap-6 hover:shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <Badge variant="outline" className="text-primary font-mono text-[10px]">
                    {insight.category}
                  </Badge>
                  <span className="text-muted-foreground">{insight.readTime}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {insight.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {insight.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-border/80 flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground">{insight.date}</span>
                <span className="text-primary font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read Clinical Article</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  )
}
