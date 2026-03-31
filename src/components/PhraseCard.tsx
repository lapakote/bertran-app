'use client'

import { useState, useRef } from 'react'
import { Volume2, Mic, MicOff, CheckCircle, XCircle } from 'lucide-react'
import type { Phrase } from '@/lib/supabase'

interface PhraseCardProps {
  phrase: Phrase
}

type RecognitionResult = 'correct' | 'incorrect' | null

export default function PhraseCard({ phrase }: PhraseCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [spokenText, setSpokenText] = useState<string | null>(null)
  const [result, setResult] = useState<RecognitionResult>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  function speak() {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(phrase.russian_text)
    utter.lang = 'ru-RU'
    utter.rate = 0.85
    utter.onstart = () => setIsPlaying(true)
    utter.onend = () => setIsPlaying(false)
    utter.onerror = () => setIsPlaying(false)
    window.speechSynthesis.speak(utter)
  }

  function startRecording() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    const SpeechRecognition = w.webkitSpeechRecognition ?? w.SpeechRecognition

    if (!SpeechRecognition) {
      alert('Ваш браузер не поддерживает распознавание речи.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'ru-RU'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsRecording(true)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = (event.results?.[0]?.[0]?.transcript ?? '').trim().toLowerCase()
      const expected = (phrase.russian_text ?? '').trim().toLowerCase()
      if (!transcript) return
      setSpokenText(transcript)
      setResult(transcript === expected ? 'correct' : 'incorrect')
    }

    recognition.onerror = () => setIsRecording(false)
    recognition.onend = () => setIsRecording(false)

    recognitionRef.current = recognition
    recognition.start()
  }

  function stopRecording() {
    recognitionRef.current?.stop()
    setIsRecording(false)
  }

  function reset() {
    setSpokenText(null)
    setResult(null)
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-4 border border-gray-100">
      {/* Phrase text */}
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-800 leading-tight">{phrase.russian_text}</p>
        {phrase.academic_context && (
          <p className="text-sm text-gray-500 mt-1">{phrase.academic_context}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3">
        {/* Listen button */}
        <button
          onClick={speak}
          disabled={isPlaying}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
            ${isPlaying
              ? 'bg-blue-100 text-blue-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white active:scale-95'
            }`}
        >
          <Volume2 size={18} />
          {isPlaying ? 'Звучит...' : 'Слушать'}
        </button>

        {/* Record button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95
            ${isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
        >
          {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          {isRecording ? 'Стоп' : 'Говорить'}
        </button>
      </div>

      {/* Recognition result */}
      {spokenText && (
        <div
          className={`rounded-xl p-3 text-sm flex flex-col gap-1
            ${result === 'correct' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
        >
          <div className="flex items-center gap-2 font-medium">
            {result === 'correct'
              ? <><CheckCircle size={16} className="text-green-600" /><span className="text-green-700">Правильно!</span></>
              : <><XCircle size={16} className="text-red-500" /><span className="text-red-600">Попробуйте ещё раз</span></>
            }
          </div>
          <p className="text-gray-500">Вы сказали: <span className="italic text-gray-700">{spokenText}</span></p>
          <button onClick={reset} className="text-xs text-blue-500 underline self-start mt-1">
            Сбросить
          </button>
        </div>
      )}
    </div>
  )
}
