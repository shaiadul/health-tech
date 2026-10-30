"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  securityPasswordSchema,
  SecurityPasswordFormValues,
} from "../schemas/settings.schema"
import { MOCK_SESSIONS } from "@/data/users"
import { SecuritySession } from "@/types/user"
import { ShieldCheck, Smartphone, Laptop, Check, Loader2, KeyRound } from "lucide-react"

export function SecuritySettings() {
  const [sessions, setSessions] = React.useState<SecuritySession[]>(MOCK_SESSIONS)
  const [twoFactorActive, setTwoFactorActive] = React.useState(true)
  const [passwordSaved, setPasswordSaved] = React.useState(false)
  const [isChangingPass, setIsChangingPass] = React.useState(false)

  const form = useForm<SecurityPasswordFormValues>({
    resolver: zodResolver(securityPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  })

  const onSubmit = async () => {
    setIsChangingPass(true)
    await new Promise((r) => setTimeout(r, 600))
    setIsChangingPass(false)
    setPasswordSaved(true)
    form.reset()
    setTimeout(() => setPasswordSaved(false), 3000)
  }

  const handleRevokeSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId))
  }

  return (
    <div className="space-y-6">
      {/* 2FA Status Card */}
      <Card className="border border-border/80">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">
                  Two-Factor Authentication (2FA)
                </CardTitle>
                <CardDescription className="text-xs">
                  Hardware FIDO2 / TOTP Authenticator enforcement
                </CardDescription>
              </div>
            </div>
            <Badge variant={twoFactorActive ? "success" : "warning"}>
              {twoFactorActive ? "Enforced & Active" : "Disabled"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Multi-factor cryptographic authorization is mandated for all wire payouts exceeding $50,000 USD.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTwoFactorActive(!twoFactorActive)}
            className="text-xs h-8"
          >
            {twoFactorActive ? "Reconfigure Authenticator Key" : "Enable 2FA"}
          </Button>
        </CardContent>
      </Card>

      {/* Password Management */}
      <Card className="border border-border/80">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">
              <KeyRound className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Update Master Password</CardTitle>
              <CardDescription className="text-xs">
                Ensure a strong 12+ character passkey with special characters
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {passwordSaved && (
            <div className="p-3 mb-4 bg-success/15 border border-success/30 text-success text-xs rounded-md flex items-center gap-2 font-medium">
              <Check className="h-4 w-4" />
              <span>Password updated successfully.</span>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Secure Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isChangingPass} className="text-xs min-w-32">
                  {isChangingPass ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Active Login Sessions */}
      <Card className="border border-border/80">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Active Device Sessions</CardTitle>
              <CardDescription className="text-xs">
                Devices authorized to access your treasury terminal
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSessions(sessions.filter((s) => s.isCurrent))}
              className="text-xs h-8 text-destructive hover:bg-destructive/10 border-destructive/30"
            >
              Revoke All Others
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="flex items-center justify-between p-3.5 rounded-lg border border-border/60 bg-muted/20"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                  {sess.device.includes("iPhone") || sess.device.includes("iPad") ? (
                    <Smartphone className="h-4 w-4" />
                  ) : (
                    <Laptop className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      {sess.device} — {sess.browser}
                    </span>
                    {sess.isCurrent && (
                      <Badge variant="success" className="text-[10px] py-0 px-1.5">
                        Current Session
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {sess.location} • {sess.ipAddress} • {sess.lastActive}
                  </p>
                </div>
              </div>

              {!sess.isCurrent && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRevokeSession(sess.id)}
                  className="text-xs h-7 text-destructive hover:bg-destructive/10"
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
