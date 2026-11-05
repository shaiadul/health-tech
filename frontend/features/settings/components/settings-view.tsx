"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "./profile-form"
import { SecuritySettings } from "./security-settings"
import { NotificationSettings } from "./notification-settings"
import { PreferenceSettings } from "./preference-settings"
import { UserProfile } from "@/types/user"
import { User, Shield, Bell, Sliders } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface SettingsViewProps {
  user: UserProfile
}

export function SettingsView({ user }: SettingsViewProps) {
  const { user: authUser, role } = useAuth()

  const effectiveUser: UserProfile = authUser
    ? {
        ...user,
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        role: authUser.roleTitle || user.role,
        avatarUrl: authUser.avatar || user.avatarUrl,
        organization: authUser.department ? `MedPulse — ${authUser.department}` : user.organization,
        phone: authUser.phone || user.phone,
      }
    : user

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {role === "doctor" ? "Physician Profile & Clinic Schedule" : "Facility & Operations Settings"}
        </h2>
        <p className="text-xs text-muted-foreground">
          {role === "doctor"
            ? "Manage physician credentials, consultation room parameters, clinical notifications, and EHR preferences"
            : "Manage clinic officer profiles, cryptographic security parameters, alerts, and localization"}
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="bg-muted p-1 rounded-lg">
          <TabsTrigger value="profile" className="gap-1.5 text-xs">
            <User className="h-3.5 w-3.5" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 text-xs">
            <Shield className="h-3.5 w-3.5" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 text-xs">
            <Bell className="h-3.5 w-3.5" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-1.5 text-xs">
            <Sliders className="h-3.5 w-3.5" />
            <span>Preferences</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="focus-visible:outline-none">
          <ProfileForm key={effectiveUser.id} user={effectiveUser} />
        </TabsContent>

        <TabsContent value="security" className="focus-visible:outline-none">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="notifications" className="focus-visible:outline-none">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="preferences" className="focus-visible:outline-none">
          <PreferenceSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
