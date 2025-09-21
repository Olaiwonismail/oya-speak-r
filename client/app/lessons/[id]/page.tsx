"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { AudioRecorder } from "@/components/audio-recorder"
import { SpeechFeedback } from "@/components/speech-feedback"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api"
import { ArrowLeft, ArrowRight, RotateCcw, Volume2 } from "lucide-react"

import Spitch from "spitch";

const spitchClient = new Spitch({ apiKey: process.env.NEXT_PUBLIC_SPITCH_API_KEY });

const languageVoices: Record<string, string> = {
  en: "john",
  ha: "hassan",
  ig: "obbina",
  yo: "femi",
};

async function playLessonText(text: string, language: string) {
  try {
    const voice = languageVoices[language] || "john"; // fallback to English
    const res = await spitchClient.speech.generate({ text, language, voice });
    const blob = await res.blob();
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    audio.play();
  } catch (err) {
    console.error("Spitch speech generation failed:", err);
  }
}

interface LessonItem {
  id: number
  text: string
  audio_url?: string
  lesson_id: number
  hint?: string
  difficulty?: number
  tips?: string[]
  expected_answer?: string
}

interface Lesson {
  id: number
  title: string
  language: string
  level: string
  created_at?: string
}

interface SpeechResult {
  transcript: string
  score: number
  word_scores: Array<{
    word: string
    score: number
    feedback: "correct" | "partial" | "incorrect"
  }>
  suggestions: string[]
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const { t } = useLanguage()
  const { user } = useAuth()
  const [lessonItems, setLessonItems] = useState<LessonItem[]>([])
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [speechResult, setSpeechResult] = useState<SpeechResult | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isPlayingReference, setIsPlayingReference] = useState(false)

  const lessonId = params.id as string
  const currentItem = lessonItems[currentItemIndex]
  const progress = lessonItems.length > 0 ? ((currentItemIndex + 1) / lessonItems.length) * 100 : 0

  useEffect(() => {
    if (lessonId) {
      fetchLessonItems()
    }
  }, [lessonId])

  const fetchLessonItems = async () => {
    try {
      setLoading(true)
      console.log("[v0] Fetching lesson items for lesson ID:", lessonId)

      const lessonIdNumber = Number.parseInt(lessonId, 10)
      if (isNaN(lessonIdNumber)) {
        throw new Error(`Invalid lesson ID: ${lessonId}`)
      }

      console.log("[v0] Converted lesson ID to number:", lessonIdNumber)

      const [itemsData, lessonsData] = await Promise.all([
        apiClient.getLessonItems(lessonIdNumber),
        apiClient.getLessons(),
      ])

      console.log("[v0] Lesson items fetched successfully:", itemsData)
      console.log("[v0] All lessons fetched:", lessonsData)

      const items = Array.isArray(itemsData) ? itemsData : []
      console.log("[v0] Processed lesson items:", items)
      setLessonItems(items)

      const allLessons = Array.isArray(lessonsData) ? lessonsData : []
      const currentLesson = allLessons.find((l) => l.id.toString() === lessonId)
      console.log("[v0] Current lesson found:", currentLesson)
      setLesson(currentLesson || null)
    } catch (error) {
      console.error("[v0] Failed to fetch lesson items:", error)
      setLessonItems([
        {
          id: 1,
          text: "Hello, how are you today?",
          difficulty: 1,
          tips: ["Focus on clear pronunciation of each word", "Pay attention to the rising intonation in questions"],
        },
        {
          id: 2,
          text: "I am fine, thank you very much.",
          difficulty: 1,
          tips: ['Emphasize "very" for natural expression', "Keep a steady pace throughout"],
        },
        {
          id: 3,
          text: "What is your name and where are you from?",
          difficulty: 2,
          tips: [
            "This is a compound question - pause slightly between parts",
            'Stress the question words "what" and "where"',
          ],
        },
        {
          id: 4,
          text: "My name is Sarah and I am from Lagos, Nigeria.",
          difficulty: 2,
          tips: ["Practice the rhythm of this longer sentence", "Clearly pronounce place names"],
        },
        {
          id: 5,
          text: "It is very nice to meet you. I hope we can be good friends.",
          difficulty: 3,
          tips: ["This is a more complex sentence with multiple clauses", "Express genuine warmth in your tone"],
        },
      ])
      setLesson({ id: Number.parseInt(lessonId), title: "Demo Lesson", language: "en", level: "beginner" })
    } finally {
      setLoading(false)
    }
  }

  const handleRecordingComplete = async (audioBlob: Blob) => {
    if (!currentItem || !lesson) return

    setProcessing(true)
    setSpeechResult(null)
    setShowFeedback(false)

    try {
      const file = new File([audioBlob], "recording.wav", { type: "audio/wav" })
      console.log("[v0] Processing recording without transcription")

      // const transcript = currentItem.expected_answer || currentItem.text
      const transcript = await apiClient.transcribeAudio(file, lesson.language)
      console.log("[v0] Using expected answer as transcript:", transcript)
  
      const scoreResult = await apiClient.scoreAttempt(currentItem.text, transcript.transcript
)
      console.log("[v0] Score result:", scoreResult)

      const result: SpeechResult = {
        transcript: transcript.transcript,
        score: scoreResult.score,
        word_scores: scoreResult.word_scores || [],
        suggestions: scoreResult.suggestions || [],
      }

      setSpeechResult(result)
      setShowFeedback(true)

      await apiClient.saveAttempt({
  lesson_item_id: currentItem.id,
  transcript: result.transcript,
  score: result.score,
  word_feedback: result.word_scores || [],
})

      // Show error to user
     
      setShowFeedback(true)
    } finally {
      setProcessing(false)
    }
  }

  const playReferenceAudio = () => {
    if (currentItem?.audio_url) {
      const audio = new Audio(currentItem.audio_url)
      setIsPlayingReference(true)
      audio.play()
      audio.onended = () => setIsPlayingReference(false)
    } else {
      const utterance = new SpeechSynthesisUtterance(currentItem?.text)
      utterance.rate = 0.8
      utterance.onstart = () => setIsPlayingReference(true)
      utterance.onend = () => setIsPlayingReference(false)
      speechSynthesis.speak(utterance)
    }
  }

  const nextItem = () => {
    if (currentItemIndex < lessonItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1)
      setSpeechResult(null)
      setShowFeedback(false)
    } else {
      router.push("/dashboard")
    }
  }

  const previousItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1)
      setSpeechResult(null)
      setShowFeedback(false)
    }
  }

  const resetAttempt = () => {
    setSpeechResult(null)
    setShowFeedback(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Please log in to access lessons</h1>
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
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground/70">Loading lesson...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lessons
          </Button>
          <div className="text-right">
            <p className="text-sm text-foreground/70">
              {currentItemIndex + 1} of {lessonItems.length}
            </p>
            <Progress value={progress} className="w-32 h-2 mt-1" />
          </div>
        </div>

        {currentItem && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Practice Speaking</CardTitle>
                  {currentItem.difficulty && <Badge variant="outline">Difficulty: {currentItem.difficulty}/5</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-foreground/80 mb-4">Read this text aloud:</h3>
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <p className="text-2xl text-foreground font-medium leading-relaxed">{currentItem.text}</p>
                  </div>
                </div>

                <div className="text-center">
                  <Button
  onClick={() => playLessonText(currentItem.text, lesson.language)}
  variant="outline"
  disabled={isPlayingReference}
>
  <Volume2 className="mr-2 h-4 w-4" />
  {isPlayingReference ? "Playing..." : "Listen to Reference"}
</Button>

                </div>

                {currentItem.tips && Array.isArray(currentItem.tips) && currentItem.tips.length > 0 && (
                  <div className="bg-accent/20 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">💡 Tips:</h4>
                    <ul className="space-y-1">
                      {currentItem.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-foreground/80">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentItem.hint && (!currentItem.tips || currentItem.tips.length === 0) && (
                  <div className="bg-accent/20 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">💡 Hint:</h4>
                    <p className="text-sm text-foreground/80">{currentItem.hint}</p>
                  </div>
                )}

                <div className="border-t pt-6">
                  <AudioRecorder onRecordingComplete={handleRecordingComplete} disabled={processing} maxDuration={30} />
                  {processing && (
                    <div className="text-center mt-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-foreground/70">Processing your speech...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {showFeedback && speechResult && (
              <SpeechFeedback
  overallScore={speechResult.score}
  wordScores={speechResult.word_scores}
  suggestions={Array.isArray(speechResult.suggestions) ? speechResult.suggestions : [speechResult.suggestions]}
  targetText={currentItem.text}
  transcript={speechResult.transcript}
/>

            )}

            <div className="flex items-center justify-between">
              <Button onClick={previousItem} disabled={currentItemIndex === 0} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-2">
                {showFeedback && (
                  <Button onClick={resetAttempt} variant="outline">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                )}
                <Button onClick={nextItem} disabled={!showFeedback}>
                  {currentItemIndex === lessonItems.length - 1 ? "Complete Lesson" : "Next"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
