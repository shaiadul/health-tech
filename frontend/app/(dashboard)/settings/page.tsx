import { MOCK_USER } from "@/data/users"
import { SettingsView } from "@/features/settings/components/settings-view"

export const metadata = {
  title: "Hospital Facility & Director Settings | MedPulse Admin",
  description: "Clinical administration credentials, electronic health record security, and clinic communication preferences.",
}

export default async function SettingsPage() {
  return <SettingsView user={MOCK_USER} />
}
