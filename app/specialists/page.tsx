import Link from "next/link"
import { SpecialistService } from "@/features/specialists/services/specialist.service"
import { MarketingNavbar } from "@/components/marketing/navbar"
import { MarketingFooter } from "@/components/marketing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Clock, Award, ShieldCheck, ArrowRight, Video, Phone, Building } from "lucide-react"

export const metadata = {
  title: "Fiduciary Specialists Directory | Finora",
  description: "Browse certified CFA®, CFP®, and CPA financial advisors with verified ratings and instant availability.",
}

export default async function SpecialistsPage() {
  const specialists = await SpecialistService.getAll()

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MarketingNavbar />
      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/20">
              Vetted Advisors
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Our Fiduciary Specialists
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every advisor on our platform is legally bound to act in your best interest. Browse by expertise and book a dedicated consultation slot.
            </p>
          </div>

          {/* Specialists List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialists.map((sp) => (
              <Card
                key={sp.id}
                className="border border-border/80 hover:border-primary/50 transition-all bg-card flex flex-col justify-between shadow-2xs group"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Avatar and rating */}
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
                      <span className="text-[10px] text-muted-foreground">({sp.reviewCount} client reviews)</span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {sp.name}
                    </h2>
                    <p className="text-xs font-medium text-primary">{sp.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {sp.experienceYears} Years Experience • {sp.role}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {sp.bio}
                  </p>

                  {/* Credentials */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                      Credentials
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {sp.credentials.map((cred, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                          {cred}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Next slot info */}
                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      Next Available:
                    </span>
                    <span className="font-mono font-semibold text-foreground text-[11px]">
                      {sp.nextAvailableSlot}
                    </span>
                  </div>
                </CardContent>

                <div className="p-5 pt-0 border-t border-border/40 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span title="Video call"><Video className="h-3.5 w-3.5" /></span>
                    <span title="Phone call"><Phone className="h-3.5 w-3.5" /></span>
                    {sp.consultationTypes.includes("in_person") && (
                      <span title="In person"><Building className="h-3.5 w-3.5" /></span>
                    )}
                  </div>

                  <Button asChild size="sm" className="text-xs h-8">
                    <Link href={`/book?specialist=${sp.id}`}>
                      <span>Book Consultation</span>
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
