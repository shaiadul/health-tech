import * as React from "react"
import { TESTIMONIALS } from "@/data/testimonials"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote, CheckCircle2 } from "lucide-react"

export function TestimonialsSection() {
  return (
    <section id="reviews" className="py-16 md:py-24 border-t border-border/60 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/20">
            Social Proof
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Trusted by 25,000+ Clients
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            See how personalized fiduciary advice helped professionals and business owners compound wealth and eliminate financial anxiety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <Card
              key={t.id}
              className="border border-border/80 bg-card/60 hover:bg-card shadow-2xs hover:border-border transition-all flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-mono text-success bg-success/10 border-success/20">
                    {t.outcomeHighlight}
                  </Badge>
                </div>

                <div className="relative">
                  <Quote className="h-6 w-6 text-muted-foreground/20 absolute -top-2 -left-2 -z-10" />
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={t.avatar} alt={t.clientName} />
                    <AvatarFallback>{t.clientName.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="truncate">
                    <p className="text-xs font-bold text-foreground truncate flex items-center gap-1">
                      {t.clientName}
                      <CheckCircle2 className="h-3 w-3 text-primary inline" />
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">{t.clientRole}</p>
                    <p className="text-[10px] text-primary/80 font-medium">{t.serviceName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
