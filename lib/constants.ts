/**
 * Application Constants — MedPulse Hospital & Healthcare Clinic
 */

export const APP_NAME = "MedPulse Clinic"
export const APP_DESCRIPTION = "Hospital outpatient triage, patient doctor appointments, and clinical operations management."

export const NAVIGATION_ITEMS = [
  {
    title: "Clinic Operations",
    href: "/dashboard",
    icon: "LayoutDashboard",
    badge: null,
  },
  {
    title: "Appointment Queue",
    href: "/transactions",
    icon: "Calendar",
    badge: "Live",
  },
  {
    title: "Physician Staff",
    href: "/accounts",
    icon: "UserCheck",
    badge: null,
  },
  {
    title: "Patient Admissions",
    href: "/payments",
    icon: "Activity",
    badge: null,
  },
  {
    title: "Clinical Analytics",
    href: "/analytics",
    icon: "LineChart",
    badge: null,
  },
  {
    title: "Facility Settings",
    href: "/settings",
    icon: "Settings",
    badge: null,
  },
] as const

export const CLINICAL_DEPARTMENTS = [
  "All Departments",
  "Cardiology & Heart Health",
  "Neurology & Brain Health",
  "Pediatrics & Child Wellness",
  "Orthopedics & Sports Medicine",
  "Internal & General Medicine",
  "Dermatology & Skin Center",
  "Executive Health Screenings",
] as const

export const APPOINTMENT_STATUS_VARIANTS: Record<
  "confirmed" | "completed" | "cancelled" | "in_consultation",
  { label: string; variant: "success" | "secondary" | "destructive" | "warning" }
> = {
  confirmed: { label: "Confirmed", variant: "warning" },
  in_consultation: { label: "In Consultation", variant: "success" },
  completed: { label: "Completed", variant: "secondary" },
  cancelled: { label: "Cancelled", variant: "destructive" },
}

export const TRANSACTION_CATEGORIES = [
  "All Categories",
  "Cardiology & Diagnostics",
  "Neurological Evaluation",
  "Pediatric Wellness",
  "Orthopedic Consultation",
  "Prescription & Pharmacy",
  "Laboratory Tests",
] as const

export const TRANSACTION_STATUS_VARIANTS: Record<
  "completed" | "pending" | "failed",
  { label: string; variant: "success" | "warning" | "destructive" }
> = {
  completed: { label: "Completed", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  failed: { label: "Failed", variant: "destructive" },
}
