'use client'

import { useState } from 'react'
import { BookOpen, GraduationCap } from 'lucide-react'
import CategoryBar from '@/components/CategoryBar'
import PhraseCard from '@/components/PhraseCard'
import { usePhrases } from '@/hooks/usePhrases'

// topic_id из таблицы topics в Supabase
const TOPIC_IDS = {
  math:     'a6d69634-8a8d-443f-a70a-2be8c9cdc5cc',
  physics:  '48bd0be6-6853-4478-a0c8-3ec1169507f1',
  chemistry:'b35f65ff-82bf-435c-bf1a-1c0dff410179',
} as const

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const topicId = selectedCategory === 'all' ? null : TOPIC_IDS[selectedCategory as keyof typeof TOPIC_IDS] ?? null
  const { phrases, loading, error } = usePhrases(topicId)

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
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

      <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-5">
        {/* Category selector */}
        <section>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Предмет</p>
          <CategoryBar selected={selectedCategory} onChange={setSelectedCategory} />
        </section>

        {/* Phrases section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-indigo-500" />
            <p className="text-sm font-semibold text-gray-700">
              {loading ? 'Загрузка...' : `${phrases.length} фраз`}
            </p>
          </div>

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
              <strong>Ошибка:</strong> {error}
              <p className="text-xs mt-1 text-red-400">Проверьте переменные окружения Supabase в .env.local</p>
            </div>
          )}

          {/* Loading skeleton */}
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

          {/* Empty state */}
          {!loading && !error && phrases.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
              <p className="font-medium">Фраз не найдено</p>
              <p className="text-xs mt-1">Добавьте записи в таблицу <code className="bg-gray-100 px-1 rounded">phrases</code> в Supabase</p>
            </div>
          )}

          {/* Phrase cards */}
          {!loading && !error && phrases.length > 0 && (
            <div className="flex flex-col gap-4">
              {phrases.map((phrase) => (
                <PhraseCard key={phrase.id} phrase={phrase} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
