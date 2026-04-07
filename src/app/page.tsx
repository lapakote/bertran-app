'use client'

import { useState, useMemo } from 'react'
import { BookOpen, GraduationCap, Plus } from 'lucide-react'
import CategoryBar from '@/components/CategoryBar'
import PhraseCard from '@/components/PhraseCard'
import SearchBar from '@/components/SearchBar'
import AddPhraseSheet from '@/components/AddPhraseSheet'
import { usePhrases } from '@/hooks/usePhrases'
import type { Phrase } from '@/lib/supabase'

const TOPIC_IDS = {
  math:     'a6d69634-8a8d-443f-a70a-2be8c9cdc5cc',
  physics:  '48bd0be6-6853-4478-a0c8-3ec1169507f1',
  chemistry:'b35f65ff-82bf-435c-bf1a-1c0dff410179',
} as const

/** Группирует фразы по первой букве русского текста */
function groupByLetter(phrases: Phrase[]): { letter: string; items: Phrase[] }[] {
  const map = new Map<string, Phrase[]>()
  for (const p of phrases) {
    const letter = (p.russian_text?.[0] ?? '#').toUpperCase()
    if (!map.has(letter)) map.set(letter, [])
    map.get(letter)!.push(p)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b, 'ru'))
    .map(([letter, items]) => ({ letter, items }))
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const topicId = selectedCategory === 'all'
    ? null
    : TOPIC_IDS[selectedCategory as keyof typeof TOPIC_IDS] ?? null

  const { phrases, loading, error, refetch } = usePhrases(topicId)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return phrases
    return phrases.filter(p =>
      p.russian_text?.toLowerCase().includes(q) ||
      p.academic_context?.toLowerCase().includes(q)
    )
  }, [phrases, search])

  const groups = useMemo(() => groupByLetter(filtered), [filtered])

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pb-28">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-xl">
            <GraduationCap size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Русский язык для Бертрана</h1>
            <p className="text-xs text-gray-400">для учёбы в универе в России</p>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-5 flex flex-col gap-4">
        {/* Category selector */}
        <section>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Предмет</p>
          <CategoryBar selected={selectedCategory} onChange={cat => { setSelectedCategory(cat); setSearch('') }} />
        </section>

        {/* Search */}
        <SearchBar value={search} onChange={setSearch} />

        {/* Phrases section */}
        <section>
          {/* Count */}
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-indigo-500" />
            <p className="text-sm font-semibold text-gray-700">
              {loading
                ? 'Загрузка...'
                : search
                  ? `${filtered.length} из ${phrases.length} фраз`
                  : `${phrases.length} фраз`
              }
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
              <strong>Ошибка:</strong> {error}
              <p className="text-xs mt-1 text-red-400">Проверьте переменные окружения Supabase в .env.local</p>
            </div>
          )}

          {/* Skeleton */}
          {loading && !error && (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 animate-pulse">
                  <div className="h-7 bg-gray-200 rounded-lg w-3/4 mx-auto mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto mb-4" />
                  <div className="flex justify-center gap-3">
                    <div className="h-9 bg-blue-100 rounded-xl w-24" />
                    <div className="h-9 bg-emerald-100 rounded-xl w-24" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
              {search
                ? <><p className="font-medium">Ничего не найдено</p><p className="text-xs mt-1">Попробуйте другой запрос</p></>
                : <><p className="font-medium">Фраз не найдено</p><button onClick={() => setShowAdd(true)} className="mt-3 text-sm text-indigo-600 underline underline-offset-2">Добавить первую фразу</button></>
              }
            </div>
          )}

          {/* Grouped phrase list */}
          {!loading && !error && filtered.length > 0 && (
            <div className="flex flex-col gap-6">
              {groups.map(({ letter, items }) => (
                <div key={letter}>
                  {/* Letter header */}
                  <div className="flex items-center gap-3 mb-3 sticky top-[73px] z-[5] -mx-1 px-1 py-1">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-md shadow-indigo-200 shrink-0">
                      {letter}
                    </div>
                    <div className="h-px flex-1 bg-indigo-100" />
                    <span className="text-xs text-indigo-400 font-medium">{items.length}</span>
                  </div>

                  {/* Cards */}
                  <div className="flex flex-col gap-4">
                    {items.map(phrase => (
                      <PhraseCard key={phrase.id} phrase={phrase} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-6 right-1/2 translate-x-1/2 max-w-[calc(448px-2rem)] w-[calc(100%-2rem)]
          flex items-center justify-center gap-2
          bg-indigo-600 hover:bg-indigo-700 text-white
          py-3.5 rounded-2xl shadow-lg shadow-indigo-300
          text-sm font-semibold active:scale-95 transition-all"
      >
        <Plus size={18} />
        Добавить свою фразу
      </button>

      {showAdd && (
        <AddPhraseSheet
          onClose={() => setShowAdd(false)}
          onSaved={refetch}
        />
      )}
    </main>
  )
}
