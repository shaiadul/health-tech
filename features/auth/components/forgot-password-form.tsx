"use client"

import * as React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  forgotPasswordSchema,
  ForgotPasswordFormValues,
} from "../schemas/auth.schema"
import { ShieldCheck, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react"

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "a.vance@vanguard-cap.io",
    },
  })

  const onSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 600))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <Card className="w-full max-w-[420px] border border-border shadow-lg bg-card">
      <CardHeader className="space-y-1 text-center pb-4">
        <div className="mx-auto h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold mb-2 shadow-xs">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl font-bold tracking-tight">
          Reset Access Credential
        </CardTitle>
        <CardDescription className="text-xs">
          Enter your company email to receive a hardware security challenge
        </CardDescription>
      </CardHeader>

      <CardContent>
        {submitted ? (
          <div className="py-4 text-center space-y-3">
            <div className="mx-auto h-10 w-10 rounded-full bg-success/15 text-success flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">
              Recovery Link Dispatched
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If an active enterprise account matches{" "}
              <strong className="text-foreground">{form.getValues("email")}</strong>, an
              instructional recovery token has been emailed.
            </p>
            <Button asChild variant="outline" className="w-full text-xs mt-3">
              <Link href="/reset-password">Proceed to Reset Password</Link>
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Work Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="officer@domain.com"
                        className="h-9 text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-xs h-9 bg-primary text-primary-foreground font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Challenge...
                  </>
                ) : (
                  "Send Recovery Link"
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>

      <CardFooter className="pt-0 text-center justify-center border-t border-border/60 py-3">
        <Link
          href="/login"
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Return to Sign In</span>
        </Link>
      </CardFooter>
    </Card>
  )
}
