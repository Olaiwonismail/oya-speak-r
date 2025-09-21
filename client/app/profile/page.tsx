"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiClient } from "@/lib/api"
import { User, Settings, Target, Bell, Globe, Save, Camera, Award, BarChart3 } from "lucide-react"

interface UserPreferences {
  language: string
  weeklyGoal: number
  notifications: {
    dailyReminder: boolean
    weeklyReport: boolean
    achievements: boolean
  }
  privacy: {
    showOnLeaderboard: boolean
    shareProgress: boolean
  }
}

interface UserStats {
  totalXP: number
  lessonsCompleted: number
  averageScore: number
  streak: number
  timeSpent: number
  languagesStudied: string[]
}

export default function ProfilePage() {
  const { t, language, setLanguage } = useLanguage()
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: "en",
    weeklyGoal: 5,
    notifications: {
      dailyReminder: true,
      weeklyReport: true,
      achievements: true,
    },
    privacy: {
      showOnLeaderboard: true,
      shareProgress: true,
    },
  })
  const [stats, setStats] = useState<UserStats>({
    totalXP: 2450,
    lessonsCompleted: 12,
    averageScore: 87,
    streak: 7,
    timeSpent: 180, // minutes
    languagesStudied: ["en", "yo", "ig"],
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) {
      fetchUserPreferences()
    }
  }, [user])

  const fetchUserPreferences = async () => {
    try {
      const data = await apiClient.getPreferences()
      console.log("[v0] User preferences loaded:", data)

      setPreferences({
        language: data.interface_language || data.target_language || "en",
        weeklyGoal: data.weekly_goal || 5,
        notifications: {
          dailyReminder: data.daily_reminder ?? true,
          weeklyReport: data.weekly_report ?? true,
          achievements: data.achievements ?? true,
        },
        privacy: {
          showOnLeaderboard: data.show_on_leaderboard ?? true,
          shareProgress: data.share_progress ?? true,
        },
      })
    } catch (error) {
      console.error("Failed to fetch preferences:", error)
    }
  }

  const savePreferences = async () => {
    setLoading(true)
    try {
      const apiPreferences = {
        interface_language: preferences.language,
        target_language: preferences.language,
        weekly_goal: preferences.weeklyGoal,
        daily_reminder: preferences.notifications.dailyReminder,
        weekly_report: preferences.notifications.weeklyReport,
        achievements: preferences.notifications.achievements,
        show_on_leaderboard: preferences.privacy.showOnLeaderboard,
        share_progress: preferences.privacy.shareProgress,
      }

      await apiClient.updatePreferences(apiPreferences)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Failed to save preferences:", error)
    } finally {
      setLoading(false)
    }
  }

  const updatePreference = (key: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const updateNestedPreference = (category: string, key: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof UserPreferences],
        [key]: value,
      },
    }))
  }

  const getLanguageName = (code: string) => {
    const languages = {
      en: "English",
      yo: "Yoruba",
      ig: "Igbo",
      ha: "Hausa",
    }
    return languages[code as keyof typeof languages] || code
  }

  const getLanguageFlag = (code: string) => {
    const flags = {
      en: "🇺🇸",
      yo: "🇳🇬",
      ig: "🇳🇬",
      ha: "🇳🇬",
    }
    return flags[code as keyof typeof flags] || "🌍"
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Please log in to access your profile</h1>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t("nav.profile")}</h1>
          <p className="text-foreground/70">Manage your account settings and learning preferences</p>
        </div>

        {saved && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              Your preferences have been saved successfully!
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="space-y-6">
              {/* Profile Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Update your personal information and profile picture</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <img
                        src="/placeholder.svg?height=80&width=80"
                        alt="Profile"
                        className="w-20 h-20 rounded-full border-2 border-border"
                      />
                      <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Profile Picture</h3>
                      <p className="text-sm text-foreground/70">Upload a new profile picture</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user.email || ""} disabled className="bg-muted/50" />
                    <p className="text-xs text-foreground/60">Email cannot be changed. Contact support if needed.</p>
                  </div>

                  {/* Display Name */}
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      placeholder="Enter your display name"
                      defaultValue={user.email?.split("@")[0] || ""}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Download My Data
                  </Button>
                  <Button variant="destructive" className="w-full justify-start">
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preferences">
            <div className="space-y-6">
              {/* Learning Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Learning Preferences
                  </CardTitle>
                  <CardDescription>Customize your learning experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Interface Language */}
                  <div className="space-y-2">
                    <Label>Interface Language</Label>
                    <Select
                      value={preferences.language}
                      onValueChange={(value) => {
                        updatePreference("language", value)
                        setLanguage(value as any)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">🇺🇸 English</SelectItem>
                        <SelectItem value="yo">🇳🇬 Yoruba</SelectItem>
                        <SelectItem value="ig">🇳🇬 Igbo</SelectItem>
                        <SelectItem value="ha">🇳🇬 Hausa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Weekly Goal */}
                  <div className="space-y-2">
                    <Label>Weekly Lesson Goal</Label>
                    <Select
                      value={preferences.weeklyGoal.toString()}
                      onValueChange={(value) => updatePreference("weeklyGoal", Number.parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 lessons per week</SelectItem>
                        <SelectItem value="5">5 lessons per week</SelectItem>
                        <SelectItem value="7">7 lessons per week</SelectItem>
                        <SelectItem value="10">10 lessons per week</SelectItem>
                        <SelectItem value="15">15 lessons per week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Choose what notifications you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Daily Reminder</h4>
                      <p className="text-sm text-foreground/70">Get reminded to practice daily</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.dailyReminder}
                      onCheckedChange={(checked) => updateNestedPreference("notifications", "dailyReminder", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Weekly Report</h4>
                      <p className="text-sm text-foreground/70">Receive weekly progress summaries</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.weeklyReport}
                      onCheckedChange={(checked) => updateNestedPreference("notifications", "weeklyReport", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Achievement Alerts</h4>
                      <p className="text-sm text-foreground/70">Get notified when you unlock achievements</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.achievements}
                      onCheckedChange={(checked) => updateNestedPreference("notifications", "achievements", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy */}
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control your privacy and data sharing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Show on Leaderboard</h4>
                      <p className="text-sm text-foreground/70">Display your progress on public leaderboards</p>
                    </div>
                    <Switch
                      checked={preferences.privacy.showOnLeaderboard}
                      onCheckedChange={(checked) => updateNestedPreference("privacy", "showOnLeaderboard", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Share Progress</h4>
                      <p className="text-sm text-foreground/70">Allow sharing of your learning progress</p>
                    </div>
                    <Switch
                      checked={preferences.privacy.shareProgress}
                      onCheckedChange={(checked) => updateNestedPreference("privacy", "shareProgress", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <Button onClick={savePreferences} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">{stats.totalXP.toLocaleString()}</div>
                      <div className="text-sm text-foreground/70">Total XP</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">{stats.lessonsCompleted}</div>
                      <div className="text-sm text-foreground/70">Lessons Completed</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">{stats.averageScore}%</div>
                      <div className="text-sm text-foreground/70">Average Score</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {Math.floor(stats.timeSpent / 60)}h {stats.timeSpent % 60}m
                      </div>
                      <div className="text-sm text-foreground/70">Time Spent</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Languages Studied */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Languages Studied
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {stats.languagesStudied.map((lang) => (
                      <Badge key={lang} variant="outline" className="text-sm py-2 px-4">
                        <span className="mr-2">{getLanguageFlag(lang)}</span>
                        {getLanguageName(lang)}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Progress Towards Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Progress Towards Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Weekly Goal</span>
                      <span>
                        {stats.lessonsCompleted} of {preferences.weeklyGoal} lessons
                      </span>
                    </div>
                    <Progress value={(stats.lessonsCompleted / preferences.weeklyGoal) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Monthly Goal</span>
                      <span>12 of 20 lessons</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { icon: "🔥", title: "Week Warrior", date: "2 days ago" },
                      { icon: "🎯", title: "First Steps", date: "1 week ago" },
                      { icon: "🌍", title: "Polyglot", date: "2 weeks ago" },
                    ].map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <h4 className="font-medium text-foreground">{achievement.title}</h4>
                          <p className="text-sm text-foreground/70">{achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
