"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ArrowUpRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function MarketingNavbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const navLinks = [
    { name: "Solutions", href: "/#solutions" },
    { name: "How it works", href: "/#how-it-works" },
    { name: "Experts", href: "/#experts" },
    { name: "Insights", href: "/#insights" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto flex h-18 items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Brand - Editorial & Minimal */}
        <Link href="/" className="flex items-baseline gap-2 group">
          <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            Finora
          </span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
        </Link>

        {/* Minimal Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-tight text-muted-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-6">
          <Link
            href="/portal"
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>Client Portal</span>
          </Link>

          <Button
            asChild
            size="sm"
            className="h-9 px-4 text-xs font-semibold rounded-none border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-1.5"
          >
            <Link href="/book">
              <span>Book a consultation</span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-90" />
            </Link>
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="flex sm:hidden items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="text-xs h-8 px-2 font-medium">
            <Link href="/portal">Portal</Link>
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-foreground">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-8 flex flex-col justify-between border-l border-border bg-background">
              <div>
                <SheetHeader className="text-left pb-6 border-b border-border">
                  <SheetTitle className="text-lg font-bold flex items-baseline gap-1.5">
                    <span>Finora</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-4 py-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-1"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link
                    href="/services"
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-1"
                  >
                    All Services
                  </Link>
                  <Link
                    href="/portal"
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-medium text-primary hover:underline transition-colors py-1 pt-3 border-t border-border flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Client Portal</span>
                  </Link>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <Button
                  asChild
                  className="w-full h-11 text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setMobileOpen(false)}
                >
                  <Link href="/book" className="flex items-center justify-center gap-1.5">
                    <span>Book a consultation</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
