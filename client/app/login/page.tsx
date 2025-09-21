"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mic, Eye, EyeOff, Loader2 } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"

const getErrorMessage = (errorCode: string, t: (key: string) => string) => {
  switch (errorCode) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return t("auth.error.invalid_credentials")
    case "auth/invalid-email":
      return t("auth.error.invalid_email")
    case "auth/user-disabled":
      return t("auth.error.user_disabled")
    case "auth/too-many-requests":
      return t("auth.error.too_many_requests")
    case "auth/network-request-failed":
      return t("auth.error.network_error")
    default:
      return t("auth.error.generic")
  }
}

export default function LoginPage() {
  const { t } = useLanguage()
  const { signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signIn(email, password)
      console.log("[v0] Login successful, redirecting to dashboard")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("[v0] Login error:", error.code)
      setError(getErrorMessage(error.code, t))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Mic className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Oyatalk</span>
          </Link>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">{t("auth.login.title")}</CardTitle>
            <CardDescription className="text-foreground/70">{t("auth.login.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  {t("auth.email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-border focus:border-primary"
                  placeholder={"Email"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  {t("auth.password")}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-border focus:border-primary pr-10"
                    placeholder={"Password"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-foreground/50" />
                    ) : (
                      <Eye className="h-4 w-4 text-foreground/50" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
                  {t("auth.forgot_password")}
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("auth.signing_in")}
                  </>
                ) : (
                  t("nav.login")
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-foreground/70">
                {t("auth.no_account")}{" "}
                <Link href="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  {t("nav.signup")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-foreground/60 hover:text-foreground transition-colors">
            {t("Back to home")}
          </Link>
        </div>
      </div>
    </div>
  )
}
