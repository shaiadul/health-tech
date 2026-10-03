import { MOCK_USER } from "@/data/users"
import { SettingsView } from "@/features/settings/components/settings-view"

export const metadata = {
  title: "Settings | Aegis Financial",
  description: "Enterprise settings, two-factor authentication, security sessions and alert rules.",
}

export default async function SettingsPage() {
  return <SettingsView user={MOCK_USER} />
}
