"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  ArrowUpRight,
  Calendar,
  Activity,
  PhoneCall,
  ChevronRight,
  Stethoscope,
  Building2,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"

export function MarketingNavbar() {
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const navLinks = [
    { name: "Departments", href: "/services" },
    { name: "Doctors", href: "/specialists" },
    { name: "Telehealth Room", href: "/consultation" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Medical FAQs", href: "/#faq" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto flex h-16 sm:h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Hospital Brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="h-9 w-9 rounded-sm bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-xs group-hover:bg-primary/90 transition-colors">
            <Activity className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
              MedPulse
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-semibold leading-tight">
              Hospital & Clinic
            </span>
          </div>
        </Link>

        {/* Desktop Navigation (Visible on lg+ screens, 1024px+) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium tracking-tight text-muted-foreground">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors hover:text-foreground ${
                  isActive ? "text-primary font-semibold" : ""
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Desktop / Tablet Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Patient Portal link */}
          <Link
            href="/portal"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground px-2.5 py-1.5 transition-colors border border-transparent hover:border-border"
          >
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>Portal</span>
          </Link>

          {/* High-Conversion Booking Button (Always visible on mobile & desktop) */}
          <Button
            asChild
            size="sm"
            className="h-9 px-3.5 sm:px-4 text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-1.5 shadow-xs"
          >
            <Link href="/book">
              <span>Book Appointment</span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-90 hidden xs:inline" />
            </Link>
          </Button>

          {/* Mobile & Tablet Drawer Trigger (Visible below lg, < 1024px) */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 text-foreground ml-1"
                aria-label="Open Navigation Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-full sm:max-w-sm p-6 flex flex-col justify-between border-l border-border bg-background"
            >
              <div className="space-y-6">
                <SheetHeader className="text-left pb-4 border-b border-border">
                  <SheetTitle className="text-base font-bold flex items-center gap-2">
                    <Activity className="h-4.5 w-4.5 text-primary" />
                    <span>MedPulse Clinic & Hospital</span>
                  </SheetTitle>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground mt-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Outpatient Triage & Emergency Open 24/7</span>
                  </div>
                </SheetHeader>

                {/* Primary Action Buttons in Mobile */}
                <div className="space-y-2">
                  <Button
                    asChild
                    className="w-full h-11 text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href="/book" className="flex items-center justify-center gap-1.5">
                      <span>Book Doctor Appointment</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full h-10 text-xs font-mono justify-center px-3"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href="/portal" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>Clinical Portal</span>
                    </Link>
                  </Button>

                  {isAuthenticated && (
                    <button
                      type="button"
                      onClick={() => {
                        logout()
                        setMobileOpen(false)
                      }}
                      className="w-full flex items-center justify-center gap-2 p-2.5 rounded-none text-xs font-semibold text-rose-500 hover:bg-rose-500/10 border border-border transition-colors cursor-pointer"
                    >
                      <span>Sign Out ({user?.name?.split(" ")[0]})</span>
                    </button>
                  )}
                </div>

                {/* Navigation Links */}
                <div className="py-2 border-t border-border space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block py-2">
                    Hospital Navigation
                  </span>

                  <Link
                    href="/services"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      <span>Clinical Departments</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>

                  <Link
                    href="/specialists"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-primary" />
                      <span>Doctors & Specialists</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>

                  <Link
                    href="/#how-it-works"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>How Booking Works</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>

                  <Link
                    href="/#faq"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    <span>Insurance & Patient FAQs</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </div>
              </div>

              {/* Emergency Hotline Contact Footer */}
              <div className="pt-4 border-t border-border space-y-2">
                <div className="p-3 bg-muted/40 border border-border flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Hospital Hotline</span>
                    <span className="font-bold text-foreground">+1 (800) 432-5847</span>
                  </div>
                  <PhoneCall className="h-4 w-4 text-primary" />
                </div>
                <p className="text-[10px] text-muted-foreground text-center">
                  For immediate acute emergencies, please dial 911 immediately.
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  )
}
