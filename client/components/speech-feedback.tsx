"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, XCircle, TrendingUp } from "lucide-react"

interface WordScore {
  word: string
  score: number
  feedback: "correct" | "partial" | "incorrect"
}

interface SpeechFeedbackProps {
  overallScore: number
  wordScores: WordScore[]
  suggestions: string[]
  targetText: string
  transcript: string
}

export function SpeechFeedback({ overallScore, wordScores, suggestions, targetText, transcript }: SpeechFeedbackProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />
    return <XCircle className="h-5 w-5 text-red-600" />
  }

  const getWordBadgeVariant = (feedback: string) => {
    switch (feedback) {
      case "correct":
        return "default"
      case "partial":
        return "secondary"
      case "incorrect":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Overall Score</h3>
            <div className="flex items-center gap-2">
              {getScoreIcon(overallScore)}
              <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}%</span>
            </div>
          </div>
          <Progress value={overallScore} className="h-3" />
          <div className="flex justify-between text-sm text-foreground/60 mt-2">
            <span>Needs Work</span>
            <span>Good</span>
            <span>Excellent</span>
          </div>
        </CardContent>
      </Card>

      {/* Text Comparison */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Text Comparison</h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-foreground/80 mb-2">Target Text:</h4>
              <p className="text-foreground bg-muted/30 p-3 rounded-lg">{targetText}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-foreground/80 mb-2">Your Speech:</h4>
              <p className="text-foreground bg-accent/20 p-3 rounded-lg">{transcript || "No transcript available"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Word-by-Word Analysis */}
      {wordScores.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Word Analysis</h3>
            <div className="flex flex-wrap gap-2">
              {wordScores.map((wordScore, index) => (
                <Badge key={index} variant={getWordBadgeVariant(wordScore.feedback)} className="text-sm py-1 px-3">
                  {wordScore.word} ({wordScore.score}%)
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Improvement Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Improvement Tips</h3>
            </div>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-foreground/80">{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
