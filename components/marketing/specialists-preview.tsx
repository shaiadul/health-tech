import * as React from "react"
import Link from "next/link"
import { SPECIALISTS } from "@/data/specialists"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Clock, Zap, ArrowRight, Video, Phone, Building } from "lucide-react"

export function SpecialistsPreview() {
  const featured = SPECIALISTS.slice(0, 4)

  return (
    <section id="specialists" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/60">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/20">
            Fiduciary Specialists
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Meet Your Advisory Partners
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            Every Finora specialist signs a legally binding fiduciary pledge: unbiased, fee-only advice with zero proprietary incentives.
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="self-start sm:self-auto text-xs h-9 border-border">
          <Link href="/specialists">View All Specialists ({SPECIALISTS.length})</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((sp) => (
          <Card
            key={sp.id}
            className="border border-border/80 hover:border-primary/50 transition-all bg-card overflow-hidden shadow-2xs flex flex-col justify-between"
          >
            <CardContent className="p-5 space-y-4">
              {/* Avatar & Availability */}
              <div className="flex items-start justify-between">
                <Avatar className="h-16 w-16 border-2 border-border/80">
                  <AvatarImage src={sp.avatar} alt={sp.name} />
                  <AvatarFallback>{sp.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-500 justify-end">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="font-bold text-xs text-foreground font-mono">{sp.rating}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">({sp.reviewCount} reviews)</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground">{sp.name}</h3>
                <p className="text-xs text-primary font-medium">{sp.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {sp.experienceYears} years experience
                </p>
              </div>

              {/* Specialties Pills */}
              <div className="flex flex-wrap gap-1">
                {sp.specialties.slice(0, 2).map((s) => (
                  <Badge key={s} variant="secondary" className="text-[10px] font-normal">
                    {s}
                  </Badge>
                ))}
              </div>

              {/* Next Available Pill */}
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-[11px] text-muted-foreground flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-primary" />
                  Next Slot:
                </span>
                <span className="font-semibold text-foreground font-mono">
                  {sp.nextAvailableSlot}
                </span>
              </div>
            </CardContent>

            <div className="p-4 pt-0 border-t border-border/40 mt-1">
              <Button asChild className="w-full text-xs h-8 font-medium">
                <Link href={`/book?specialist=${sp.id}`}>
                  <span>Book with {sp.name.split(" ")[0]}</span>
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
