export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  role: string
  organization: string
  avatarUrl: string
  tier: "Enterprise" | "Pro" | "Growth"
  twoFactorEnabled: boolean
  currency: string
  language: string
  theme: "system" | "light" | "dark"
}

export interface SecuritySession {
  id: string
  device: string
  browser: string
  location: string
  ipAddress: string
  lastActive: string
  isCurrent: boolean
}
