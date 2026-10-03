/**
 * FinTech Formatting Utilities
 * Centralized formatting functions to guarantee consistency across the app.
 * Supports minor units (cents) representation to prevent floating point inaccuracies.
 */

/**
 * Format money in minor units (e.g., cents: 125000 -> $1,250.00) or standard unit
 * Defaults to USD, locale 'en-US'
 */
export function formatCurrency(
  amountInMinorUnits: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  const amount = amountInMinorUnits / 100
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format money with compact notation for large stats (e.g., $1.2M, $45.8K)
 */
export function formatCompactCurrency(
  amountInMinorUnits: number,
  currency: string = "USD"
): string {
  const amount = amountInMinorUnits / 100
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount)
}

/**
 * Format date string or Date object into human-readable format
 */
export function formatDate(
  dateInput: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  }
  return new Intl.DateTimeFormat("en-US", options || defaultOptions).format(date)
}

/**
 * Format date and time
 */
export function formatDateTime(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

/**
 * Format relative date (e.g. "Today", "Yesterday", "3 days ago")
 */
export function formatRelativeDate(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return "Today"
  if (diffInDays === 1) return "Yesterday"
  if (diffInDays < 7) return `${diffInDays} days ago`
  return formatDate(date)
}

/**
 * Format percentage (e.g., 0.125 -> "+12.5%", -0.04 -> "-4.0%")
 */
export function formatPercentage(
  rate: number,
  includeSign: boolean = true
): string {
  const formatted = `${(Math.abs(rate) * 100).toFixed(1)}%`
  if (!includeSign) return formatted
  return rate >= 0 ? `+${formatted}` : `-${formatted}`
}

/**
 * Mask account number for security (e.g., "•••• 4821")
 */
export function maskAccountNumber(accountNumber: string): string {
  if (!accountNumber) return "•••• 0000"
  const clean = accountNumber.replace(/\s+/g, "")
  const last4 = clean.slice(-4)
  return `•••• ${last4}`
}

/**
 * Mask credit card number (e.g., "•••• •••• •••• 1290")
 */
export function maskCardNumber(cardNumber: string): string {
  if (!cardNumber) return "•••• •••• •••• 0000"
  const clean = cardNumber.replace(/\s+/g, "")
  const last4 = clean.slice(-4)
  return `•••• •••• •••• ${last4}`
}
