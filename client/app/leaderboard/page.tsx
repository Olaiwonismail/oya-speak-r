"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiClient } from "@/lib/api"
import { Trophy, Medal, Award, Crown, Flame, Zap, TrendingUp, Users, Calendar, Globe } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  username: string
  avatar?: string
  xp: number
  streak: number
  lessonsCompleted: number
  averageScore: number
  isCurrentUser?: boolean
}

export default function LeaderboardPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([])
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [selectedLanguage])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const params = selectedLanguage !== "all" ? selectedLanguage : undefined
      const data = await apiClient.getLeaderboard(params)

      // This would normally come from the API
      // For demo, we'll use mock data
      const mockGlobalData: LeaderboardEntry[] = [
        {
          rank: 1,
          username: "LanguageMaster",
          xp: 15420,
          streak: 45,
          lessonsCompleted: 127,
          averageScore: 96,
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          rank: 2,
          username: "PolyglotPro",
          xp: 14850,
          streak: 38,
          lessonsCompleted: 119,
          averageScore: 94,
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          rank: 3,
          username: "SpeechChampion",
          xp: 13920,
          streak: 42,
          lessonsCompleted: 105,
          averageScore: 92,
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          rank: 4,
          username: "VoiceVirtuoso",
          xp: 12750,
          streak: 29,
          lessonsCompleted: 98,
          averageScore: 91,
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          rank: 5,
          username: "FluentFriend",
          xp: 11680,
          streak: 33,
          lessonsCompleted: 89,
          averageScore: 89,
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          rank: 6,
          username: user?.email?.split("@")[0] || "You",
          xp: 2450,
          streak: 7,
          lessonsCompleted: 12,
          averageScore: 87,
          isCurrentUser: true,
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ]

      const mockWeeklyData: LeaderboardEntry[] = [
        {
          rank: 1,
          username: "WeeklyWarrior",
          xp: 1250,
          streak: 7,
          lessonsCompleted: 15,
          averageScore: 94,
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          rank: 2,
          username: "SprintStar",
          xp: 1180,
          streak: 6,
          lessonsCompleted: 14,
          averageScore: 91,
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          rank: 3,
          username: user?.email?.split("@")[0] || "You",
          xp: 890,
          streak: 7,
          lessonsCompleted: 8,
          averageScore: 87,
          isCurrentUser: true,
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ]

      setGlobalLeaderboard(mockGlobalData)
      setWeeklyLeaderboard(mockWeeklyData)
      setCurrentUserRank(6)
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-foreground/70">#{rank}</span>
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case 2:
        return "bg-gray-100 text-gray-800 border-gray-200"
      case 3:
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Please log in to view the leaderboard</h1>
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t("nav.leaderboard")}</h1>
          <p className="text-foreground/70">See how you rank against other language learners</p>
        </div>

        {/* Language Filter */}
        <div className="flex justify-center mb-8">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-64">
              <Globe className="mr-2 h-4 w-4" />
              <SelectValue placeholder="All Languages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="en">🇺🇸 English</SelectItem>
              <SelectItem value="yo">🇳🇬 Yoruba</SelectItem>
              <SelectItem value="ig">🇳🇬 Igbo</SelectItem>
              <SelectItem value="ha">🇳🇬 Hausa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Current User Rank Card */}
        {currentUserRank && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">#{currentUserRank}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Your Current Rank</h3>
                    <p className="text-sm text-foreground/70">
                      You're in the top {Math.round((currentUserRank / 1000) * 100)}% of learners!
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">2,450 XP</p>
                  <p className="text-sm text-foreground/70">7-day streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard Tabs */}
        <Tabs defaultValue="global" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="global" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              All Time
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              This Week
            </TabsTrigger>
          </TabsList>

          <TabsContent value="global">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Global Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                        <div className="w-12 h-12 bg-muted rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-24"></div>
                        </div>
                        <div className="h-6 bg-muted rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {globalLeaderboard.map((entry) => (
                      <div
                        key={entry.rank}
                        className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                          entry.isCurrentUser ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center justify-center w-12">{getRankIcon(entry.rank)}</div>

                        <img
                          src={entry.avatar || "/placeholder.svg?height=40&width=40"}
                          alt={entry.username}
                          className="w-10 h-10 rounded-full"
                        />

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-semibold ${entry.isCurrentUser ? "text-primary" : "text-foreground"}`}>
                              {entry.username}
                              {entry.isCurrentUser && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  You
                                </Badge>
                              )}
                            </h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-foreground/70">
                            <span className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              {entry.xp.toLocaleString()} XP
                            </span>
                            <span className="flex items-center gap-1">
                              <Flame className="h-3 w-3" />
                              {entry.streak} streak
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {entry.averageScore}% avg
                            </span>
                          </div>
                        </div>

                        <Badge className={getRankBadgeColor(entry.rank)}>#{entry.rank}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Weekly Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {weeklyLeaderboard.map((entry) => (
                    <div
                      key={entry.rank}
                      className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                        entry.isCurrentUser ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-center w-12">{getRankIcon(entry.rank)}</div>

                      <img
                        src={entry.avatar || "/placeholder.svg?height=40&width=40"}
                        alt={entry.username}
                        className="w-10 h-10 rounded-full"
                      />

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${entry.isCurrentUser ? "text-primary" : "text-foreground"}`}>
                            {entry.username}
                            {entry.isCurrentUser && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                You
                              </Badge>
                            )}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-foreground/70">
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {entry.xp.toLocaleString()} XP this week
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {entry.lessonsCompleted} lessons
                          </span>
                        </div>
                      </div>

                      <Badge className={getRankBadgeColor(entry.rank)}>#{entry.rank}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Motivation Section */}
        <Card className="mt-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-8 text-center">
            <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Keep Learning to Climb Higher!</h3>
            <p className="text-foreground/70 mb-6">
              Complete more lessons and maintain your streak to improve your ranking
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/lessons">Start Learning</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">View Progress</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
