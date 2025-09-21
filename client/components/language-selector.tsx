"use client"

import { useLanguage, type Language } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

const languages = [
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
  { code: "yo" as Language, name: "Yorùbá", flag: "🇳🇬" },
  { code: "ig" as Language, name: "Igbo", flag: "🇳🇬" },
  { code: "ha" as Language, name: "Hausa", flag: "🇳🇬" },
]

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const currentLang = languages.find((lang) => lang.code === language)

  return (
    <DropdownMenu>
      {/* Use plain button instead of asChild */}
      <DropdownMenuTrigger>
        <button className="inline-flex items-center gap-2 px-2 py-1 rounded-md border bg-white hover:bg-gray-100">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLang?.name}</span>
          <span className="sm:hidden">{currentLang?.flag}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-50">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? "bg-accent" : ""}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
