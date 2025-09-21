"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { LanguageSelector } from "./language-selector"
import { Button } from "@/components/ui/button"
import { Mic, Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const { t } = useLanguage()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = user
    ? [
        { name: t("nav.dashboard"), href: "/dashboard" },
        { name: t("nav.lessons"), href: "/lessons" },
        { name: t("nav.leaderboard"), href: "/leaderboard" },
        { name: t("nav.profile"), href: "/profile" },
      ]
    : [
        { name: t("nav.home"), href: "/" },
        { name: t("nav.features"), href: "#features" },
        { name: t("nav.about"), href: "#about" },
      ]

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mic className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Oyatalk</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <LanguageSelector />

            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-sm text-foreground/80">{user.email}</span>
                <Button onClick={logout} variant="outline" size="sm">
                  {t("nav.logout")}
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">{t("nav.login")}</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">{t("nav.signup")}</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground/80 hover:text-foreground transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {!user && (
                <div className="flex gap-2 px-2 pt-2 border-t border-border">
                  <Button asChild variant="ghost" size="sm" className="flex-1">
                    <Link href="/login">{t("nav.login")}</Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link href="/signup">{t("nav.signup")}</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
