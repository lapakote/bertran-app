'use client'

import { useState, useMemo } from 'react'
import { BookOpen, GraduationCap, Plus } from 'lucide-react'
import CategoryBar from '@/components/CategoryBar'
import PhraseCard from '@/components/PhraseCard'
import SearchBar from '@/components/SearchBar'
import AddPhraseSheet from '@/components/AddPhraseSheet'
import { usePhrases } from '@/hooks/usePhrases'
import { useProgress } from '@/hooks/useProgress'
import type { Phrase } from '@/lib/supabase'

const TOPIC_IDS = {
  math:      'a6d69634-8a8d-443f-a70a-2be8c9cdc5cc',
  physics:   '48bd0be6-6853-4478-a0c8-3ec1169507f1',
  chemistry: 'b35f65ff-82bf-435c-bf1a-1c0dff410179',
} as const

type ProgressFilter = 'all' | 'learning' | 'learned'

function groupByLetter(phrases: Phrase[]) {
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
  const [search, setSearch]                     = useState('')
  const [progressFilter, setProgressFilter]     = useState<ProgressFilter>('all')
  const [showAdd, setShowAdd]                   = useState(false)

  const topicId = selectedCategory === 'all'
    ? null
    : TOPIC_IDS[selectedCategory as keyof typeof TOPIC_IDS] ?? null

  const { phrases, loading, error, refetch } = usePhrases(topicId)
  const { learned, toggle, isLearned }        = useProgress()

  // Stats for progress bar
  const learnedCount = useMemo(
    () => phrases.filter(p => learned.has(p.id)).length,
    [phrases, learned]
  )
  const progressPct = phrases.length > 0 ? Math.round((learnedCount / phrases.length) * 100) : 0

  // Filter by search + progress tab
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return phrases.filter(p => {
      if (progressFilter === 'learned'  && !learned.has(p.id)) return false
      if (progressFilter === 'learning' &&  learned.has(p.id)) return false
      if (q) return p.russian_text?.toLowerCase().includes(q) || p.academic_context?.toLowerCase().includes(q)
      return true
    })
  }, [phrases, search, progressFilter, learned])

  const groups = useMemo(() => groupByLetter(filtered), [filtered])

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pb-28">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-xl shrink-0">
            <GraduationCap size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 leading-tight truncate">Русский язык для Бертрана</h1>
            <p className="text-xs text-gray-400">для учёбы в универе в России</p>
          </div>
        </div>

        {/* Progress bar */}
        {!loading && phrases.length > 0 && (
          <div className="max-w-md mx-auto px-4 pb-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Прогресс</span>
              <span className="font-semibold text-indigo-600">{learnedCount} / {phrases.length} — {progressPct}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
      </header>

      <div className="max-w-md mx-auto px-4 py-5 flex flex-col gap-4">
        {/* Category */}
        <section>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Предмет</p>
          <CategoryBar
            selected={selectedCategory}
            onChange={cat => { setSelectedCategory(cat); setSearch('') }}
          />
        </section>

        {/* Search */}
        <SearchBar value={search} onChange={setSearch} />

        {/* Progress filter tabs */}
        <div className="flex gap-2">
          {([
            ['all',      'Все'],
            ['learning', 'Учу'],
            ['learned',  'Выучил'],
          ] as [ProgressFilter, string][]).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setProgressFilter(id)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all active:scale-95
                ${progressFilter === id
                  ? id === 'learned'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-300'
                }`}
            >
              {label}
              {id === 'learned' && learnedCount > 0 && (
                <span className={`ml-1.5 text-xs font-bold ${progressFilter === 'learned' ? 'text-emerald-200' : 'text-emerald-500'}`}>
                  {learnedCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Phrases section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-indigo-500" />
            <p className="text-sm font-semibold text-gray-700">
              {loading
                ? 'Загрузка...'
                : (search || progressFilter !== 'all')
                  ? `${filtered.length} из ${phrases.length} фраз`
                  : `${phrases.length} фраз`
              }
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
              <strong>Ошибка:</strong> {error}
            </div>
          )}

          {/* Skeleton */}
          {loading && !error && (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 animate-pulse">
                  <div className="h-7 bg-gray-200 rounded-lg w-3/4 mx-auto mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto mb-4" />
                  <div className="flex justify-center gap-3">
                    <div className="h-9 bg-blue-100 rounded-xl w-24" />
                    <div className="h-9 bg-violet-100 rounded-xl w-24" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
              {search || progressFilter !== 'all'
                ? <p className="font-medium">Ничего не найдено</p>
                : <>
                    <p className="font-medium">Фраз не найдено</p>
                    <button onClick={() => setShowAdd(true)} className="mt-3 text-sm text-indigo-600 underline underline-offset-2">
                      Добавить первую фразу
                    </button>
                  </>
              }
            </div>
          )}

          {/* Grouped list */}
          {!loading && !error && filtered.length > 0 && (
            <div className="flex flex-col gap-6">
              {groups.map(({ letter, items }) => (
                <div key={letter}>
                  <div className="flex items-center gap-3 mb-3 sticky top-[73px] z-[5] -mx-1 px-1 py-1">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-md shadow-indigo-200 shrink-0">
                      {letter}
                    </div>
                    <div className="h-px flex-1 bg-indigo-100" />
                    <span className="text-xs text-indigo-400 font-medium">{items.length}</span>
                  </div>
                  <div className="flex flex-col gap-4">
                    {items.map(phrase => (
                      <PhraseCard
                        key={phrase.id}
                        phrase={phrase}
                        learned={isLearned(phrase.id)}
                        onToggleLearned={toggle}
                        onDeleted={refetch}
                      />
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
