"use client"

import { useLanguage } from "@/contexts/language-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Mic,
  Globe,
  Trophy,
  TrendingUp,
  Download,
  Users,
  Star,
  CheckCircle,
  Zap,
  Target,
  BookOpen,
  BarChart3,
} from "lucide-react"

export default function HomePage() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Mic,
      title: t("features.speak.title"),
      description: t("features.speak.description"),
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Globe,
      title: t("features.multilingual.title"),
      description: t("features.multilingual.description"),
      color: "bg-secondary/10 text-secondary",
    },
    {
      icon: Trophy,
      title: t("features.gamified.title"),
      description: t("features.gamified.description"),
      color: "bg-accent/10 text-accent-foreground",
    },
    {
      icon: TrendingUp,
      title: t("features.progress.title"),
      description: t("features.progress.description"),
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Download,
      title: t("features.offline.title"),
      description: t("features.offline.description"),
      color: "bg-secondary/10 text-secondary",
    },
    {
      icon: Users,
      title: t("features.community.title"),
      description: t("features.community.description"),
      color: "bg-accent/10 text-accent-foreground",
    },
  ]

  const stats = [
    { number: "50,000+", label: t("stats.users"), icon: Users },
    { number: "1,200+", label: t("stats.lessons"), icon: BookOpen },
    { number: "4", label: t("stats.languages"), icon: Globe },
    { number: "94%", label: t("stats.accuracy"), icon: Target },
  ]

  const testimonials = [
    {
      name: "Adunni Okafor",
      role: "Student, Lagos",
      content:
        "Oyatalk helped me perfect my English pronunciation while staying connected to my Yoruba roots. The AI feedback is incredibly accurate!",
      rating: 5,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Chidi Nwankwo",
      role: "Business Professional",
      content:
        "Learning Hausa for business has never been easier. The gamification keeps me motivated, and I can practice anywhere.",
      rating: 5,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Fatima Abdullahi",
      role: "Teacher, Abuja",
      content:
        "I use Oyatalk to improve my English and Igbo. The progress tracking helps me see real improvement in my pronunciation.",
      rating: 5,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const howItWorks = [
    {
      step: 1,
      title: "Choose Your Language",
      description: "Select from English, Yoruba, Igbo, or Hausa and set your learning goals.",
      icon: Globe,
    },
    {
      step: 2,
      title: "Practice Speaking",
      description: "Record yourself speaking phrases and receive instant AI-powered feedback.",
      icon: Mic,
    },
    {
      step: 3,
      title: "Track Progress",
      description: "Monitor your improvement with detailed analytics and earn achievement badges.",
      icon: BarChart3,
    },
    {
      step: 4,
      title: "Join Community",
      description: "Compete with other learners and celebrate your language learning journey.",
      icon: Users,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className=" items-center">
            <div className="text-center ">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                🚀 Now with Advanced AI Speech Recognition
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance text-center">
                {t("hero.title")}
              </h1>
              <p className="text-xl text-foreground/80 mb-8 text-pretty mx-auto">{t("hero.subtitle")}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-center">
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link href="/signup">
                    <Zap className="mr-2 h-5 w-5" />
                    {t("hero.cta")}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10"></div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
              
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
                <div className="text-foreground/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How Oyatalk Works</h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Start your language learning journey in just four simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-foreground/70">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t("features.title")}</h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">{t("features.subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t("testimonials.title")}</h2>
            <p className="text-xl text-foreground/80">{t("testimonials.subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-foreground/80 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-foreground/60">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Powered By Section */}
      <section className="py-16 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-semibold text-foreground mb-8">{t("footer.powered_by")}</h3>
          <div className="flex justify-center items-center">
            <div className="flex items-center gap-4 bg-card rounded-lg px-8 py-4 border border-border/50">
              <span className="text-xl font-bold text-foreground">Spitch.studio</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t("cta.title")}</h2>
          <p className="text-xl text-foreground/80 mb-8">{t("cta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/signup">
                <CheckCircle className="mr-2 h-5 w-5" />
                {t("cta.button")}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              <Link href="/login">{t("nav.login")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Mic className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Oyatalk</span>
              </div>
              <p className="text-background/80 mb-4">{t("footer.tagline")}</p>
              <div className="flex gap-4"></div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <Link href="#features" className="block text-background/80 hover:text-background transition-colors">
                  {t("nav.features")}
                </Link>
                <Link href="/lessons" className="block text-background/80 hover:text-background transition-colors">
                  {t("nav.lessons")}
                </Link>
                <Link href="/leaderboard" className="block text-background/80 hover:text-background transition-colors">
                  {t("nav.leaderboard")}
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <Link href="/about" className="block text-background/80 hover:text-background transition-colors">
                  {t("footer.links.about")}
                </Link>
                <Link href="/privacy" className="block text-background/80 hover:text-background transition-colors">
                  {t("footer.links.privacy")}
                </Link>
                <Link href="/terms" className="block text-background/80 hover:text-background transition-colors">
                  {t("footer.links.terms")}
                </Link>
                <Link href="/contact" className="block text-background/80 hover:text-background transition-colors">
                  {t("footer.links.contact")}
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center">
            <p className="text-background/60">{t("footer.copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
