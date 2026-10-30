import * as React from "react"
import { cn } from "@/lib/utils"

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: "7xl" | "6xl" | "5xl" | "4xl" | "full"
  paddingY?: "default" | "compact" | "spacious" | "none"
  paddingX?: "default" | "none"
  as?: React.ElementType
}

const MAX_WIDTH_MAP = {
  "7xl": "max-w-7xl",
  "6xl": "max-w-6xl",
  "5xl": "max-w-5xl",
  "4xl": "max-w-4xl",
  full: "w-full",
}

const PADDING_Y_MAP = {
  default: "py-10 md:py-16",
  compact: "py-6 md:py-10",
  spacious: "py-14 md:py-24",
  none: "py-0",
}

const PADDING_X_MAP = {
  default: "px-4 sm:px-6 lg:px-8",
  none: "px-0",
}

export function PageContainer({
  children,
  className,
  maxWidth = "7xl",
  paddingY = "default",
  paddingX = "default",
  as: Component = "div",
  ...props
}: PageContainerProps) {
  return (
    <Component
      className={cn(
        "w-full mx-auto",
        MAX_WIDTH_MAP[maxWidth],
        PADDING_Y_MAP[paddingY],
        PADDING_X_MAP[paddingX],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
