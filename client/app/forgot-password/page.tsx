"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mic, Loader2, CheckCircle } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"

const getResetErrorMessage = (errorCode: string, t: (key: string) => string) => {
  switch (errorCode) {
    case "auth/user-not-found":
      return t("auth.error.user_not_found")
    case "auth/invalid-email":
      return t("auth.error.invalid_email")
    case "auth/network-request-failed":
      return t("auth.error.network_error")
    default:
      return t("auth.error.generic")
  }
}

export default function ForgotPasswordPage() {
  const { t } = useLanguage()
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await resetPassword(email)
      console.log("[v0] Password reset email sent successfully")
      setSuccess(true)
    } catch (error: any) {
      console.error("[v0] Password reset error:", error.code)
      setError(getResetErrorMessage(error.code, t))
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
            <CardTitle className="text-2xl font-bold text-foreground">{t("auth.reset_password.title")}</CardTitle>
            <CardDescription className="text-foreground/70">{t("auth.reset_password.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{t("auth.reset_password.check_email")}</h3>
                  <p className="text-foreground/70 mb-4">
                    {t("auth.reset_password.email_sent")} {email}
                  </p>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/login">{t("auth.reset_password.back_to_login")}</Link>
                  </Button>
                </div>
              </div>
            ) : (
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
                    placeholder={t("auth.email_placeholder")}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("auth.reset_password.sending")}
                    </>
                  ) : (
                    t("auth.reset_password.send_link")
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                {t("auth.reset_password.back_to_login")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
