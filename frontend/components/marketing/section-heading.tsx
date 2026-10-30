import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  eyebrow: string
  title: React.ReactNode
  description?: string
  align?: "left" | "center"
  tone?: "light" | "dark"
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-3 max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <span
        className={cn(
          "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest",
          tone === "dark" ? "text-teal-300" : "text-primary"
        )}
      >
        <span className="h-px w-6 bg-current" />
        {eyebrow}
      </span>
      <h2
        className={cn(
          "text-3xl sm:text-4xl font-bold tracking-tight leading-tight",
          tone === "dark" ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-base leading-relaxed",
            tone === "dark" ? "text-white/70" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
