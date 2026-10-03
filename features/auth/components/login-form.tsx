"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { loginSchema, LoginFormValues } from "../schemas/auth.schema"
import { APP_NAME } from "@/lib/constants"
import { ShieldCheck, Eye, EyeOff, Loader2, KeyRound } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [authError, setAuthError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "a.vance@vanguard-cap.io",
      password: "EnterpriseMaster2026!",
      rememberMe: true,
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true)
    setAuthError(null)

    // Simulate authentication delay
    await new Promise((r) => setTimeout(r, 600))

    if (!values.email.includes("@")) {
      setAuthError("Invalid credentials. Please verify your institutional email.")
      setIsSubmitting(false)
      return
    }

    // Direct to dashboard
    router.push("/dashboard")
  }

  const handleFillDemo = () => {
    form.setValue("email", "a.vance@vanguard-cap.io")
    form.setValue("password", "EnterpriseMaster2026!")
  }

  return (
    <Card className="w-full max-w-[420px] border border-border shadow-lg bg-card">
      <CardHeader className="space-y-1 text-center pb-4">
        <div className="mx-auto h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold mb-2 shadow-xs">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl font-bold tracking-tight">
          Sign In to {APP_NAME}
        </CardTitle>
        <CardDescription className="text-xs">
          Enter your institutional credentials to access treasury terminal
        </CardDescription>
      </CardHeader>

      <CardContent>
        {authError && (
          <Alert variant="destructive" className="mb-4 text-xs">
            <AlertTitle>Authentication Failed</AlertTitle>
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Work Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@company.com"
                      className="h-9 text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-xs">Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-[11px] text-primary hover:underline font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="h-9 text-xs pr-9"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-xs h-9 bg-primary text-primary-foreground font-medium shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying Session...
                </>
              ) : (
                "Authenticate Terminal"
              )}
            </Button>
          </form>
        </Form>

        {/* Quick Demo Fill button */}
        <div className="mt-4 pt-4 border-t border-border/60 text-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleFillDemo}
            className="w-full text-xs h-8 border-dashed text-muted-foreground hover:text-foreground"
          >
            <KeyRound className="h-3 w-3 mr-1.5" />
            <span>Fill Demo Credentials (Alexandra Vance)</span>
          </Button>
        </div>
      </CardContent>

      <CardFooter className="pt-0 text-center justify-center">
        <p className="text-[11px] text-muted-foreground">
          Protected by AES-256 Bit Hardware Security Module.
        </p>
      </CardFooter>
    </Card>
  )
}
