'use client'

import { useState, useRef } from 'react'
import { Volume2, Mic, MicOff, CheckCircle, XCircle, Trash2, BadgeCheck } from 'lucide-react'
import { supabase, type Phrase } from '@/lib/supabase'

interface PhraseCardProps {
  phrase: Phrase
  learned: boolean
  onToggleLearned: (id: string) => void
  onDeleted: () => void
}

type RecognitionResult = 'correct' | 'incorrect' | null

export default function PhraseCard({ phrase, learned, onToggleLearned, onDeleted }: PhraseCardProps) {
  const [isPlaying, setIsPlaying]       = useState(false)
  const [isRecording, setIsRecording]   = useState(false)
  const [spokenText, setSpokenText]     = useState<string | null>(null)
  const [result, setResult]             = useState<RecognitionResult>(null)
  const [deleting, setDeleting]         = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  function speak() {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(phrase.russian_text)
    utter.lang = 'ru-RU'
    utter.rate = 0.85
    utter.onstart = () => setIsPlaying(true)
    utter.onend   = () => setIsPlaying(false)
    utter.onerror = () => setIsPlaying(false)
    window.speechSynthesis.speak(utter)
  }

  function startRecording() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    const SR = w.webkitSpeechRecognition ?? w.SpeechRecognition
    if (!SR) { alert('Ваш браузер не поддерживает распознавание речи.'); return }

    const recognition = new SR()
    recognition.lang = 'ru-RU'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onstart = () => setIsRecording(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = (event.results?.[0]?.[0]?.transcript ?? '').trim().toLowerCase()
      const expected   = (phrase.russian_text ?? '').trim().toLowerCase()
      if (!transcript) return
      setSpokenText(transcript)
      setResult(transcript === expected ? 'correct' : 'incorrect')
    }
    recognition.onerror = () => setIsRecording(false)
    recognition.onend   = () => setIsRecording(false)
    recognitionRef.current = recognition
    recognition.start()
  }

  function stopRecording() {
    recognitionRef.current?.stop()
    setIsRecording(false)
  }

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return }
    setDeleting(true)
    await supabase.from('phrases').delete().eq('id', phrase.id)
    onDeleted()
  }

  return (
    <div className={`bg-white rounded-2xl shadow-md border transition-colors
      ${learned ? 'border-emerald-300 shadow-emerald-100' : 'border-gray-100'}`}
    >
      {/* Learned banner */}
      {learned && (
        <div className="bg-emerald-50 rounded-t-2xl px-4 py-1.5 flex items-center gap-1.5 border-b border-emerald-100">
          <BadgeCheck size={14} className="text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-600">Выучено</span>
        </div>
      )}

      <div className="p-5 flex flex-col gap-4">
        {/* Phrase text */}
        <div className="text-center">
          <p className={`text-2xl font-bold leading-tight ${learned ? 'text-emerald-700' : 'text-gray-800'}`}>
            {phrase.russian_text}
          </p>
          {phrase.academic_context && (
            <p className="text-sm text-gray-500 mt-1">{phrase.academic_context}</p>
          )}
        </div>

        {/* Buttons row */}
        <div className="flex justify-center gap-2 flex-wrap">
          <button
            onClick={speak}
            disabled={isPlaying}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${isPlaying ? 'bg-blue-100 text-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white active:scale-95'}`}
          >
            <Volume2 size={17} />
            {isPlaying ? 'Звучит...' : 'Слушать'}
          </button>

          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95
              ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-violet-500 hover:bg-violet-600 text-white'}`}
          >
            {isRecording ? <MicOff size={17} /> : <Mic size={17} />}
            {isRecording ? 'Стоп' : 'Говорить'}
          </button>

          <button
            onClick={() => onToggleLearned(phrase.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95
              ${learned
                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
              }`}
          >
            <BadgeCheck size={17} />
            {learned ? 'Выучено' : 'Выучил'}
          </button>
        </div>

        {/* Recognition result */}
        {spokenText && (
          <div className={`rounded-xl p-3 text-sm flex flex-col gap-1
            ${result === 'correct' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
          >
            <div className="flex items-center gap-2 font-medium">
              {result === 'correct'
                ? <><CheckCircle size={15} className="text-green-600" /><span className="text-green-700">Правильно!</span></>
                : <><XCircle size={15} className="text-red-500" /><span className="text-red-600">Попробуйте ещё раз</span></>
              }
            </div>
            <p className="text-gray-500">Вы сказали: <span className="italic text-gray-700">{spokenText}</span></p>
            <button
              onClick={() => { setSpokenText(null); setResult(null) }}
              className="text-xs text-blue-500 underline self-start mt-1"
            >
              Сбросить
            </button>
          </div>
        )}

        {/* Delete */}
        <div className="flex justify-end">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-500">Удалить фразу?</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg active:scale-95 disabled:opacity-50"
              >
                {deleting ? '...' : 'Да'}
              </button>
              <button onClick={() => setConfirmDelete(false)} className="text-xs text-gray-400 px-2 py-1">
                Нет
              </button>
            </div>
          ) : (
            <button
              onClick={handleDelete}
              className="text-gray-300 hover:text-red-400 transition-colors p-1"
              title="Удалить фразу"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
