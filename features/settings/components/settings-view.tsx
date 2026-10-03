"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "./profile-form"
import { SecuritySettings } from "./security-settings"
import { NotificationSettings } from "./notification-settings"
import { PreferenceSettings } from "./preference-settings"
import { UserProfile } from "@/types/user"
import { User, Shield, Bell, Sliders } from "lucide-react"

interface SettingsViewProps {
  user: UserProfile
}

export function SettingsView({ user }: SettingsViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          System & Enterprise Settings
        </h2>
        <p className="text-xs text-muted-foreground">
          Manage officer profiles, cryptographic security parameters, alerts, and localization
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
          <ProfileForm user={user} />
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
