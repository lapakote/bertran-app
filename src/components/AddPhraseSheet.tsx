'use client'

import { useState } from 'react'
import { X, Wand2, Loader2, Plus, Calculator, Atom, FlaskConical } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { translateRuToEn } from '@/lib/translate'

const TOPICS = [
  { id: 'a6d69634-8a8d-443f-a70a-2be8c9cdc5cc', label: 'Математика', icon: Calculator, color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { id: '48bd0be6-6853-4478-a0c8-3ec1169507f1', label: 'Физика',     icon: Atom,        color: 'bg-violet-100 text-violet-700 border-violet-300' },
  { id: 'b35f65ff-82bf-435c-bf1a-1c0dff410179', label: 'Химия',      icon: FlaskConical, color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
]

interface AddPhraseSheetProps {
  onClose: () => void
  onSaved: () => void
}

export default function AddPhraseSheet({ onClose, onSaved }: AddPhraseSheetProps) {
  const [russianText, setRussianText]   = useState('')
  const [englishText, setEnglishText]   = useState('')
  const [topicId, setTopicId]           = useState(TOPICS[0].id)
  const [translating, setTranslating]   = useState(false)
  const [saving, setSaving]             = useState(false)
  const [translateError, setTranslateError] = useState<string | null>(null)
  const [saveError, setSaveError]           = useState<string | null>(null)

  async function handleTranslate() {
    const text = russianText.trim()
    if (!text) return
    setTranslating(true)
    setTranslateError(null)
    try {
      const result = await translateRuToEn(text)
      setEnglishText(result)
    } catch {
      setTranslateError('Не удалось перевести. Введите перевод вручную.')
    } finally {
      setTranslating(false)
    }
  }

  async function handleSave() {
    const rt = russianText.trim()
    const et = englishText.trim()
    if (!rt) return
    setSaving(true)
    setSaveError(null)
    const { error } = await supabase.from('phrases').insert({
      topic_id:         topicId,
      russian_text:     rt,
      academic_context: et || null,
      difficulty_level: 1,
      audio_url:        null,
    })
    setSaving(false)
    if (error) {
      setSaveError(error.message)
    } else {
      onSaved()
      onClose()
    }
  }

  // Закрытие по клику на фон
  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[90dvh]">
        {/* Ручка */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Заголовок */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Добавить фразу</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Содержимое */}
        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-5">

          {/* Русская фраза */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Фраза на русском *
            </label>
            <textarea
              value={russianText}
              onChange={e => setRussianText(e.target.value)}
              placeholder="Например: интеграл по частям"
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          {/* Кнопка перевода */}
          <button
            onClick={handleTranslate}
            disabled={!russianText.trim() || translating}
            className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all
              ${!russianText.trim() || translating
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:scale-95'
              }`}
          >
            {translating
              ? <><Loader2 size={16} className="animate-spin" /> Переводим...</>
              : <><Wand2 size={16} /> Перевести автоматически</>
            }
          </button>

          {translateError && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              {translateError}
            </p>
          )}

          {/* Перевод (редактируемый) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Перевод / контекст (английский)
            </label>
            <textarea
              value={englishText}
              onChange={e => setEnglishText(e.target.value)}
              placeholder="Integration by parts"
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          {/* Выбор предмета */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Предмет
            </label>
            <div className="flex gap-2">
              {TOPICS.map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => setTopicId(id)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-all
                    ${topicId === id ? color + ' border-2' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'}`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {saveError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              Ошибка сохранения: {saveError}
            </p>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={!russianText.trim() || saving}
            className={`flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all
              ${!russianText.trim() || saving
                ? 'bg-indigo-300 text-white cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200'
              }`}
          >
            {saving
              ? <><Loader2 size={16} className="animate-spin" /> Сохраняем...</>
              : <><Plus size={16} /> Добавить</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}
