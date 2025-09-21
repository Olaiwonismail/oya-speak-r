"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Mic, Square, Play, Pause, RotateCcw } from "lucide-react"

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void
  maxDuration?: number
  disabled?: boolean
}

export function AudioRecorder({ onRecordingComplete, maxDuration = 30, disabled = false }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close()
      }
    }
  }, [audioUrl])

  const convertToPCMWav = async (audioBuffer: AudioBuffer): Promise<Blob> => {
    const length = audioBuffer.length
    const sampleRate = audioBuffer.sampleRate
    const channels = audioBuffer.numberOfChannels

    const buffer = new ArrayBuffer(44 + length * channels * 2)
    const view = new DataView(buffer)

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }

    writeString(0, "RIFF")
    view.setUint32(4, 36 + length * channels * 2, true)
    writeString(8, "WAVE")
    writeString(12, "fmt ")
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, channels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * channels * 2, true)
    view.setUint16(32, channels * 2, true)
    view.setUint16(34, 16, true)
    writeString(36, "data")
    view.setUint32(40, length * channels * 2, true)

    let offset = 44
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < channels; channel++) {
        const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]))
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
        offset += 2
      }
    }

    return new Blob([buffer], { type: "audio/wav" })
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      audioContextRef.current = new AudioContext({ sampleRate: 16000 })
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream)

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/wav")
          ? "audio/wav"
          : MediaRecorder.isTypeSupported("audio/webm;codecs=pcm")
            ? "audio/webm;codecs=pcm"
            : "audio/webm",
      })

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        try {
          const rawBlob = new Blob(chunksRef.current, { type: "audio/wav" })

          if (!audioContextRef.current || audioContextRef.current.state === "closed") {
            console.log("[v0] AudioContext unavailable, using fallback")
            const fallbackBlob = new Blob(chunksRef.current, { type: "audio/wav" })
            setAudioBlob(fallbackBlob)
            const url = URL.createObjectURL(fallbackBlob)
            setAudioUrl(url)
            onRecordingComplete(fallbackBlob)
            stream.getTracks().forEach((track) => track.stop())
            return
          }

          const arrayBuffer = await rawBlob.arrayBuffer()
          const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer)

          const pcmWavBlob = await convertToPCMWav(audioBuffer)

          console.log("[v0] Created 16-bit PCM WAV:", {
            size: pcmWavBlob.size,
            type: pcmWavBlob.type,
            sampleRate: audioBuffer.sampleRate,
            channels: audioBuffer.numberOfChannels,
            duration: audioBuffer.duration,
          })

          setAudioBlob(pcmWavBlob)
          const url = URL.createObjectURL(pcmWavBlob)
          setAudioUrl(url)
           

          onRecordingComplete(pcmWavBlob)
        } catch (error) {
          console.error("[v0] Error processing audio:", error)
          const fallbackBlob = new Blob(chunksRef.current, { type: "audio/wav" })
          setAudioBlob(fallbackBlob)
          const url = URL.createObjectURL(fallbackBlob)
          setAudioUrl(url)
          onRecordingComplete(fallbackBlob)
        }

        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= maxDuration) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const resetRecording = () => {
    setAudioBlob(null)
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioUrl(null)
    setRecordingTime(0)
    setIsPlaying(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4">
        {!audioBlob ? (
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={disabled}
            size="lg"
            className={`w-16 h-16 rounded-full ${
              isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-primary hover:bg-primary/90"
            }`}
          >
            {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button onClick={isPlaying ? pauseRecording : playRecording} size="lg" className="w-12 h-12 rounded-full">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button
              onClick={resetRecording}
              variant="outline"
              size="lg"
              className="w-12 h-12 rounded-full bg-transparent"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {(isRecording || audioBlob) && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-foreground/70">
            <span>{formatTime(recordingTime)}</span>
            <span>{formatTime(maxDuration)}</span>
          </div>
          <Progress value={(recordingTime / maxDuration) * 100} className="h-2" />
        </div>
      )}

      <div className="text-center text-sm text-foreground/70">
        {isRecording ? (
          <span className="text-red-500 font-medium">Recording...</span>
        ) : audioBlob ? (
          <span className="text-green-600 font-medium">Recording ready</span>
        ) : (
          <span>Tap to start recording</span>
        )}
      </div>

      {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />}
    </div>
  )
}
