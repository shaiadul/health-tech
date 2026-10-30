"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Check } from "lucide-react"

export function NotificationSettings() {
  const [settings, setSettings] = React.useState({
    transactionAlerts: true,
    largeTransferAlerts: true,
    securityAlerts: true,
    weeklySummaryDigest: true,
    marketingUpdates: false,
  })
  const [saved, setSaved] = React.useState(false)

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const items = [
    {
      key: "transactionAlerts" as const,
      title: "Real-time Transaction Notifications",
      desc: "Receive instant push and email alerts for every debit or credit.",
    },
    {
      key: "largeTransferAlerts" as const,
      title: "High-Value Transfer Approvals",
      desc: "Notify financial controllers for any disbursement exceeding $25,000 USD.",
    },
    {
      key: "securityAlerts" as const,
      title: "Security & Login Warnings",
      desc: "Immediate alerts when a new device or unfamiliar geographic IP authenticates.",
    },
    {
      key: "weeklySummaryDigest" as const,
      title: "Weekly CFO Treasury Digest",
      desc: "Consolidated executive summary of burn rates, APY accrual, and runway.",
    },
    {
      key: "marketingUpdates" as const,
      title: "New Feature & Product Releases",
      desc: "Quarterly updates on expanding international clearing rails and FX tools.",
    },
  ]

  return (
    <Card className="border border-border/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Alert & Notification Rules</CardTitle>
            <CardDescription className="text-xs">
              Configure operational alerts, dual-sign thresholds, and reporting digests
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {saved && (
          <div className="p-3 bg-success/15 border border-success/30 text-success text-xs rounded-md flex items-center gap-2 font-medium">
            <Check className="h-4 w-4" />
            <span>Notification preferences updated.</span>
          </div>
        )}

        <div className="divide-y divide-border/60">
          {items.map((item) => (
            <div
              key={item.key}
              className="py-3.5 flex items-center justify-between gap-4"
            >
              <div>
                <h4 className="text-xs font-semibold text-foreground">{item.title}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings[item.key]}
                onClick={() => toggle(item.key)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  settings[item.key] ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
                    settings[item.key] ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <Button onClick={handleSave} className="text-xs">
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
