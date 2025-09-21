"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { apiClient } from "@/lib/api"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshToken = async () => {
    if (user) {
      try {
        const token = await user.getIdToken(true) // Force refresh
        apiClient.setAuthToken(token)
        console.log("[v0] Token refreshed successfully")
      } catch (error) {
        console.error("[v0] Token refresh failed:", error)
      }
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("[v0] Auth state changed:", user?.email || "No user")
      setUser(user)

      if (user) {
        try {
          const token = await user.getIdToken()
          apiClient.setAuthToken(token)
          console.log("[v0] Firebase token set for API requests")

          try {
            const preferences = await apiClient.getPreferences()
            console.log("[v0] User preferences loaded:", preferences)
          } catch (error) {
            console.log("[v0] No existing preferences found, will create on first save")
          }
        } catch (error) {
          console.error("[v0] Error setting up user session:", error)
        }
      } else {
        apiClient.setAuthToken("")
        console.log("[v0] Cleared API token")
      }
      setLoading(false)
    })

    const tokenRefreshInterval = setInterval(
      () => {
        if (user) {
          refreshToken()
        }
      },
      50 * 60 * 1000,
    ) // Refresh every 50 minutes

    return () => {
      unsubscribe()
      clearInterval(tokenRefreshInterval)
    }
  }, [user])

  const signIn = async (email: string, password: string) => {
    try {
      console.log("[v0] Attempting sign in for:", email)
      await signInWithEmailAndPassword(auth, email, password)
      console.log("[v0] Sign in successful")
    } catch (error: any) {
      console.error("[v0] Sign in error:", error.code)
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      console.log("[v0] Attempting sign up for:", email)
      await createUserWithEmailAndPassword(auth, email, password)
      console.log("[v0] Sign up successful")
    } catch (error: any) {
      console.error("[v0] Sign up error:", error.code)
      throw error
    }
  }

  const logout = async () => {
    try {
      console.log("[v0] Logging out user")
      await signOut(auth)
      console.log("[v0] Logout successful")
    } catch (error) {
      console.error("[v0] Logout error:", error)
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      console.log("[v0] Sending password reset email to:", email)
      await sendPasswordResetEmail(auth, email)
      console.log("[v0] Password reset email sent")
    } catch (error: any) {
      console.error("[v0] Password reset error:", error.code)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logout, resetPassword, refreshToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
