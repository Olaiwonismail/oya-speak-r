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
import { Checkbox } from "@/components/ui/checkbox"
import { Mic, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"

const getSignupErrorMessage = (errorCode: string, t: (key: string) => string) => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return t("auth.error.email_in_use")
    case "auth/invalid-email":
      return t("auth.error.invalid_email")
    case "auth/weak-password":
      return t("auth.error.weak_password")
    case "auth/network-request-failed":
      return t("auth.error.network_error")
    default:
      return t("auth.error.generic")
  }
}

export default function SignupPage() {
  const { t } = useLanguage()
  const { signUp } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const passwordRequirements = [
    { text: t("auth.password_req.length"), met: password.length >= 8 },
    { text: t("auth.password_req.uppercase"), met: /[A-Z]/.test(password) },
    { text: t("auth.password_req.lowercase"), met: /[a-z]/.test(password) },
    { text: t("auth.password_req.number"), met: /\d/.test(password) },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError(t("auth.error.passwords_no_match"))
      setLoading(false)
      return
    }

    if (!acceptTerms) {
      setError(t("auth.error.accept_terms"))
      setLoading(false)
      return
    }

    try {
      await signUp(email, password)
      console.log("[v0] Signup successful, redirecting to dashboard")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("[v0] Signup error:", error.code)
      setError(getSignupErrorMessage(error.code, t))
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
            <CardTitle className="text-2xl font-bold text-foreground">{t("auth.signup.title")}</CardTitle>
            <CardDescription className="text-foreground/70">{t("auth.signup.subtitle")}</CardDescription>
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
                  {t("Email")}
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
                    placeholder={t("Password")}
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

                {password && (
                  <div className="space-y-1 mt-2">
                    <p className="text-sm text-foreground/70 mb-2">{t("auth.password_requirements")}</p>
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className={`h-3 w-3 ${req.met ? "text-green-500" : "text-foreground/30"}`} />
                        <span className={req.met ? "text-green-600" : "text-foreground/60"}>{req.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">
                  {t("Password")}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="border-border focus:border-primary pr-10"
                    placeholder={t("Confirm Password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-foreground/50" />
                    ) : (
                      <Eye className="h-4 w-4 text-foreground/50" />
                    )}
                  </Button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-sm text-red-500">{t("auth.error.passwords_no_match")}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm text-foreground/70">
                  {t("Terms & agreement")}{" "}
                  <Link href="/terms" className="text-primary hover:text-primary/80">
                    {t("footer.links.terms")}
                  </Link>{" "}
                  {t("")}{" "}
                  <Link href="/privacy" className="text-primary hover:text-primary/80">
                    {t("footer.links.privacy")}
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading || !acceptTerms}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("auth.creating_account")}
                  </>
                ) : (
                  t("nav.signup")
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-foreground/70">
                {t("auth.have_account")}{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  {t("nav.login")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-foreground/60 hover:text-foreground transition-colors">
            {t("back to home")}
          </Link>
        </div>
      </div>
    </div>
  )
}
