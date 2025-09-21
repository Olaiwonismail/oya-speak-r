"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Language, getTranslation, type TranslationKey } from "@/lib/translations"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const { user } = useAuth()

  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred-language") as Language
    if (savedLanguage && ["en", "yo", "ig", "ha"].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
      console.log("[v0] Loaded language from localStorage:", savedLanguage)
    }
  }, [])

  useEffect(() => {
    if (user) {
      loadUserLanguagePreference()
    }
  }, [user])

  const loadUserLanguagePreference = async () => {
    try {
      const preferences = await apiClient.getPreferences()
      if (preferences.interface_language && ["en", "yo", "ig", "ha"].includes(preferences.interface_language)) {
        setLanguageState(preferences.interface_language as Language)
        localStorage.setItem("preferred-language", preferences.interface_language)
        console.log("[v0] Loaded language from user preferences:", preferences.interface_language)
      }
    } catch (error) {
      console.log("[v0] Could not load user language preferences, using localStorage")
    }
  }

  const setLanguage = async (lang: Language) => {
    console.log("[v0] Changing language to:", lang)
    setLanguageState(lang)
    localStorage.setItem("preferred-language", lang)

    if (user) {
      try {
        await apiClient.updatePreferences({ interface_language: lang })
        console.log("[v0] Language preference saved to backend")
      } catch (error) {
        console.error("[v0] Failed to save language preference to backend:", error)
      }
    }
  }

  const t = (key: TranslationKey) => getTranslation(key, language)

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
