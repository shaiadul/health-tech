/**
 * Application Constants
 */

export const APP_NAME = "Aegis Financial"
export const APP_DESCRIPTION = "Next-generation institutional and personal financial operations platform."

export const NAVIGATION_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    badge: null,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: "Receipt",
    badge: null,
  },
  {
    title: "Accounts",
    href: "/accounts",
    icon: "WalletCards",
    badge: null,
  },
  {
    title: "Payments & Transfer",
    href: "/payments",
    icon: "ArrowLeftRight",
    badge: "Fast",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: "LineChart",
    badge: null,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "Settings",
    badge: null,
  },
] as const

export const TRANSACTION_CATEGORIES = [
  "All Categories",
  "Technology & Software",
  "Payroll & Income",
  "Office & Infrastructure",
  "Travel & Entertainment",
  "Cloud & Hosting",
  "Professional Services",
  "Food & Dining",
  "Utilities & Telecommunications",
  "Investment & Dividends",
] as const

export const ACCOUNT_TYPES = [
  { id: "checking", label: "Business Checking", description: "Primary operational treasury" },
  { id: "savings", label: "High-Yield Reserve", description: "Interest bearing capital vault" },
  { id: "credit", label: "Corporate Credit", description: "Revolving expense line" },
  { id: "investment", label: "Yield & Treasury", description: "Fixed income & short-term notes" },
] as const

export const TRANSACTION_STATUS_VARIANTS: Record<
  "completed" | "pending" | "failed",
  { label: string; variant: "success" | "warning" | "destructive" }
> = {
  completed: { label: "Completed", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  failed: { label: "Failed", variant: "destructive" },
}
