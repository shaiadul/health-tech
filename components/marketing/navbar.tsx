"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShieldCheck, Menu, X, ArrowRight, Calendar, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function MarketingNavbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const navLinks = [
    { name: "Services", href: "/#services" },
    { name: "Specialists", href: "/#specialists" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Reviews", href: "/#reviews" },
    { name: "FAQ", href: "/#faq" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-foreground flex items-center gap-1">
              Finora
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-primary/10 text-primary border border-primary/20">
                Fiduciary
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/services"
            className="hover:text-foreground transition-colors"
          >
            All Services
          </Link>
        </nav>

        {/* CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="text-xs h-9 gap-1.5">
            <Link href="/portal">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>My Appointments</span>
            </Link>
          </Button>

          <Button asChild size="sm" className="text-xs h-9 gap-1.5 shadow-xs bg-primary text-primary-foreground font-semibold">
            <Link href="/book">
              <span>Book a Consultation</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <Button asChild size="xs" variant="outline" className="text-xs h-8">
            <Link href="/portal">Portal</Link>
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-6 flex flex-col justify-between">
              <div>
                <SheetHeader className="text-left pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <SheetTitle className="text-base font-bold">Finora</SheetTitle>
                  </div>
                </SheetHeader>

                <div className="flex flex-col gap-3 py-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground py-1"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link
                    href="/services"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground py-1"
                  >
                    Browse All Services
                  </Link>
                  <Link
                    href="/portal"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-primary hover:underline py-1 flex items-center gap-1.5"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>My Customer Portal</span>
                  </Link>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <Button asChild className="w-full text-xs" onClick={() => setMobileOpen(false)}>
                  <Link href="/book">Book Consultation Now</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
