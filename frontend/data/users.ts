import { UserProfile, SecuritySession } from "@/types/user"

export const MOCK_USER: UserProfile = {
  id: "usr_clinic_01",
  name: "Dr. Sarah Ahmed, MD, FACC",
  email: "s.ahmed@medpulse.health",
  phone: "+1 (800) 432-5847",
  role: "Chief Medical Officer & Outpatient Director",
  organization: "MedPulse Hospital & Health Center",
  avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
  tier: "Enterprise",
  twoFactorEnabled: true,
  currency: "USD",
  language: "en-US",
  theme: "system",
}

export const MOCK_SESSIONS: SecuritySession[] = [
  {
    id: "sess_curr_01",
    device: "Clinical Workstation A-12",
    browser: "Chrome 128.0 (Encrypted EHR)",
    location: "MedPulse Hospital Center, Boston, MA",
    ipAddress: "10.240.12.8",
    lastActive: "Active now",
    isCurrent: true,
  },
  {
    id: "sess_02",
    device: "iPad Pro (Doctor Rounds)",
    browser: "Safari Mobile 17.4",
    location: "Exam Room Wing 3",
    ipAddress: "10.240.14.99",
    lastActive: "25 minutes ago",
    isCurrent: false,
  },
]
