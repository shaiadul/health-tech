"use client"

import * as React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { QuickActionDialogs, QuickActionType } from "@/components/layout/quick-action-dialogs"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeQuickAction, setActiveQuickAction] = React.useState<QuickActionType>(null)

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Header onOpenQuickAction={(action) => setActiveQuickAction(action)} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in-50 duration-200">
          {children}
        </main>
      </div>

      {/* Global Quick Action Modal */}
      <QuickActionDialogs
        action={activeQuickAction}
        onClose={() => setActiveQuickAction(null)}
      />
    </div>
  )
}
