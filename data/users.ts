import { UserProfile, SecuritySession } from "@/types/user"

export const MOCK_USER: UserProfile = {
  id: "usr_99812480",
  name: "Alexandra Vance",
  email: "a.vance@vanguard-cap.io",
  phone: "+1 (415) 890-4421",
  role: "Chief Financial Officer",
  organization: "Vance Global Technologies Inc.",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  tier: "Enterprise",
  twoFactorEnabled: true,
  currency: "USD",
  language: "en-US",
  theme: "system",
}

export const MOCK_SESSIONS: SecuritySession[] = [
  {
    id: "sess_curr_01",
    device: "MacBook Pro 16\"",
    browser: "Chrome 128.0",
    location: "San Francisco, CA, USA",
    ipAddress: "192.0.2.45",
    lastActive: "Active now",
    isCurrent: true,
  },
  {
    id: "sess_02",
    device: "iPhone 15 Pro",
    browser: "Safari Mobile 17.4",
    location: "San Francisco, CA, USA",
    ipAddress: "198.51.100.12",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
  {
    id: "sess_03",
    device: "iPad Pro",
    browser: "Mobile Safari 17.2",
    location: "New York, NY, USA",
    ipAddress: "203.0.113.89",
    lastActive: "3 days ago",
    isCurrent: false,
  },
]
