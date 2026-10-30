"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { profileSchema, ProfileFormValues } from "../schemas/settings.schema"
import { UserProfile } from "@/types/user"
import { Check, Loader2, Upload } from "lucide-react"

interface ProfileFormProps {
  user: UserProfile
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isSaved, setIsSaved] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      organization: user.organization,
    },
  })

  const onSubmit = async () => {
    setIsSubmitting(true)
    setIsSaved(false)
    await new Promise((r) => setTimeout(r, 600))
    setIsSubmitting(false)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <Card className="border border-border/80">
      <CardHeader>
        <CardTitle className="text-base font-bold">Executive Profile</CardTitle>
        <CardDescription className="text-xs">
          Manage your verified enterprise credentials and contact information
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSaved && (
          <div className="p-3 mb-4 bg-success/15 border border-success/30 text-success text-xs rounded-md flex items-center gap-2 font-medium">
            <Check className="h-4 w-4" />
            <span>Profile updated successfully.</span>
          </div>
        )}

        {/* Avatar Bar */}
        <div className="flex items-center gap-4 pb-6 mb-6 border-b border-border/60">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>AV</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-sm font-semibold text-foreground">{user.name}</h4>
            <p className="text-xs text-muted-foreground">{user.role} • {user.organization}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-xs h-7 gap-1 border-border"
              onClick={() => alert("Avatar image upload simulated.")}
            >
              <Upload className="h-3 w-3" />
              <span>Change Photo</span>
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Legal Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Direct Telephone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Executive Role</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Corporate Entity / Holding</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2 flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="min-w-28 text-xs">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
