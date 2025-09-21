"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api"
import Link from "next/link"
import {
  Flame,
  Zap,
  BookOpen,
  TrendingUp,
  Calendar,
  Clock,
  Target,
  Award,
  Play,
  RotateCcw,
  Star,
  ChevronRight,
  Trophy,
} from "lucide-react"

interface UserStats {
  streak: number
  totalXP: number
  lessonsCompleted: number
  averageScore: number
  weeklyGoal: number
  weeklyProgress: number
}

interface RecentActivity {
  id: string
  type: "lesson" | "practice" | "achievement"
  title: string
  score?: number
  timestamp: string
  language: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress?: number
  maxProgress?: number
}

export default function DashboardPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStats>({
    streak: 0,
    totalXP: 0,
    lessonsCompleted: 0,
    averageScore: 0,
    weeklyGoal: 5,
    weeklyProgress: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch user attempts and calculate stats
      const attempts = await apiClient.getAttempts()

      // This would normally come from the API
      // For demo, we'll use mock data
      setStats({
        streak: 7,
        totalXP: 2450,
        lessonsCompleted: 12,
        averageScore: 87,
        weeklyGoal: 5,
        weeklyProgress: 3,
      })

      setRecentActivity([
        {
          id: "1",
          type: "lesson",
          title: "Basic Greetings",
          score: 92,
          timestamp: "2 hours ago",
          language: "en",
        },
        {
          id: "2",
          type: "achievement",
          title: "Week Warrior",
          timestamp: "1 day ago",
          language: "en",
        },
        {
          id: "3",
          type: "lesson",
          title: "Yoruba Fundamentals",
          score: 85,
          timestamp: "2 days ago",
          language: "yo",
        },
        {
          id: "4",
          type: "practice",
          title: "Pronunciation Practice",
          score: 78,
          timestamp: "3 days ago",
          language: "ig",
        },
      ])

      setAchievements([
        {
          id: "1",
          title: "First Steps",
          description: "Complete your first lesson",
          icon: "🎯",
          unlocked: true,
        },
        {
          id: "2",
          title: "Week Warrior",
          description: "Maintain a 7-day streak",
          icon: "🔥",
          unlocked: true,
        },
        {
          id: "3",
          title: "Polyglot",
          description: "Practice in 3 different languages",
          icon: "🌍",
          unlocked: true,
        },
        {
          id: "4",
          title: "Perfect Score",
          description: "Get 100% on any lesson",
          icon: "⭐",
          unlocked: false,
          progress: 92,
          maxProgress: 100,
        },
        {
          id: "5",
          title: "Marathon Runner",
          description: "Complete 50 lessons",
          icon: "🏃",
          unlocked: false,
          progress: 12,
          maxProgress: 50,
        },
      ])
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return <BookOpen className="h-4 w-4" />
      case "practice":
        return <Target className="h-4 w-4" />
      case "achievement":
        return <Award className="h-4 w-4" />
      default:
        return <Star className="h-4 w-4" />
    }
  }

  const getLanguageFlag = (lang: string) => {
    switch (lang) {
      case "en":
        return "🇺🇸"
      case "yo":
        return "🇳🇬"
      case "ig":
        return "🇳🇬"
      case "ha":
        return "🇳🇬"
      default:
        return "🌍"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Please log in to access your dashboard</h1>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground/70">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("dashboard.welcome")}, {user.email?.split("@")[0]}! 👋
          </h1>
          <p className="text-foreground/70">Ready to continue your language learning journey?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/70">{t("dashboard.streak")}</p>
                  <p className="text-2xl font-bold text-foreground">{stats.streak}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Flame className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/70">{t("dashboard.xp")}</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalXP.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/70">{t("dashboard.lessons_completed")}</p>
                  <p className="text-2xl font-bold text-foreground">{stats.lessonsCompleted}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/70">Average Score</p>
                  <p className="text-2xl font-bold text-foreground">{stats.averageScore}%</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Weekly Goal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Weekly Goal
                </CardTitle>
                <CardDescription>Complete {stats.weeklyGoal} lessons this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>
                      {stats.weeklyProgress} of {stats.weeklyGoal} lessons
                    </span>
                    <span>{Math.round((stats.weeklyProgress / stats.weeklyGoal) * 100)}%</span>
                  </div>
                  <Progress value={(stats.weeklyProgress / stats.weeklyGoal) * 100} className="h-3" />
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/70">
                      {stats.weeklyGoal - stats.weeklyProgress} lessons to go
                    </span>
                    <Button asChild size="sm">
                      <Link href="/lessons">
                        <Play className="mr-2 h-4 w-4" />
                        Continue Learning
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Continue Learning */}
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.continue_learning")}</CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Business English</h4>
                        <p className="text-sm text-foreground/70">Lesson 3 of 25 • 65% complete</p>
                      </div>
                    </div>
                    <Button asChild>
                      <Link href="/lessons/3">
                        <Play className="mr-2 h-4 w-4" />
                        Continue
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Practice Mistakes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  {t("dashboard.practice_mistakes")}
                </CardTitle>
                <CardDescription>Review phrases you found challenging</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { text: "How are you doing today?", score: 72, language: "en" },
                    { text: "Bawo ni o se wa?", score: 68, language: "yo" },
                    { text: "Kedu ka i mere?", score: 75, language: "ig" },
                  ].map((mistake, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getLanguageFlag(mistake.language)}</span>
                        <div>
                          <p className="font-medium text-foreground">{mistake.text}</p>
                          <p className="text-sm text-foreground/70">Previous score: {mistake.score}%</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Practice
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t("dashboard.recent_activity")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-3 hover:bg-muted/20 rounded-lg transition-colors"
                    >
                      <div className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{activity.title}</p>
                          <span className="text-lg">{getLanguageFlag(activity.language)}</span>
                          {activity.score && (
                            <Badge variant="outline" className="text-xs">
                              {activity.score}%
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-foreground/70">{activity.timestamp}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-foreground/30" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <Link href="/lessons">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Lessons
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/leaderboard">
                    <Trophy className="mr-2 h-4 w-4" />
                    View Leaderboard
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/profile">
                    <Target className="mr-2 h-4 w-4" />
                    Update Goals
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
                <CardDescription>
                  {achievements.filter((a) => a.unlocked).length} of {achievements.length} unlocked
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.slice(0, 4).map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-3 rounded-lg border ${
                        achievement.unlocked ? "bg-accent/20 border-accent/30" : "bg-muted/20 border-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-2xl ${!achievement.unlocked && "grayscale opacity-50"}`}>
                          {achievement.icon}
                        </span>
                        <div className="flex-1">
                          <h4
                            className={`font-medium ${achievement.unlocked ? "text-foreground" : "text-foreground/50"}`}
                          >
                            {achievement.title}
                          </h4>
                          <p className="text-xs text-foreground/70">{achievement.description}</p>
                          {!achievement.unlocked && achievement.progress && achievement.maxProgress && (
                            <div className="mt-2">
                              <Progress
                                value={(achievement.progress / achievement.maxProgress) * 100}
                                className="h-1"
                              />
                              <p className="text-xs text-foreground/60 mt-1">
                                {achievement.progress}/{achievement.maxProgress}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button asChild variant="ghost" className="w-full mt-4">
                  <Link href="/achievements">View All Achievements</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
