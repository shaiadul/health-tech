"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Check, Globe, Moon, Sun, Monitor } from "lucide-react"

export function PreferenceSettings() {
  const [currency, setCurrency] = React.useState("USD")
  const [language, setLanguage] = React.useState("en-US")
  const [theme, setTheme] = React.useState<"system" | "light" | "dark">("system")
  const [saved, setSaved] = React.useState(false)

  const handleSave = () => {
    // Apply dark class to document if dark
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Card className="border border-border/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Localization & Display</CardTitle>
            <CardDescription className="text-xs">
              Configure accounting currency standard, localized formats, and visual theme
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {saved && (
          <div className="p-3 bg-success/15 border border-success/30 text-success text-xs rounded-md flex items-center gap-2 font-medium">
            <Check className="h-4 w-4" />
            <span>Preferences applied successfully.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Primary Reporting Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($) — United States Dollar</SelectItem>
                <SelectItem value="EUR">EUR (€) — Euro</SelectItem>
                <SelectItem value="GBP">GBP (£) — British Pound</SelectItem>
                <SelectItem value="SGD">SGD (S$) — Singapore Dollar</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              All portfolio ledgers and chart aggregations normalize to this currency.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Locale & Number Formatting</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English (United States)</SelectItem>
                <SelectItem value="en-GB">English (United Kingdom)</SelectItem>
                <SelectItem value="es-ES">Español (España)</SelectItem>
                <SelectItem value="de-DE">Deutsch (Deutschland)</SelectItem>
                <SelectItem value="ja-JP">日本語 (日本)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Defines decimal separators, date formatting, and regional notations.
            </p>
          </div>
        </div>

        {/* Theme Mode Selector */}
        <div className="space-y-2 pt-2 border-t border-border/60">
          <Label className="text-xs font-medium">Visual Interface Theme</Label>
          <div className="grid grid-cols-3 gap-3">
            <div
              onClick={() => setTheme("system")}
              className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                theme === "system"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:bg-muted/30"
              }`}
            >
              <Monitor className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <span className="text-xs font-medium">System Auto</span>
            </div>

            <div
              onClick={() => setTheme("light")}
              className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                theme === "light"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:bg-muted/30"
              }`}
            >
              <Sun className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <span className="text-xs font-medium">Light</span>
            </div>

            <div
              onClick={() => setTheme("dark")}
              className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                theme === "dark"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:bg-muted/30"
              }`}
            >
              <Moon className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <span className="text-xs font-medium">Dark Mode</span>
            </div>
          </div>
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
