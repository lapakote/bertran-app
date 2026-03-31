'use client'

import { useEffect, useState } from 'react'
import { supabase, type Phrase } from '@/lib/supabase'

export function usePhrases(topicId: string | null) {
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPhrases() {
      setLoading(true)
      setError(null)

      const query = supabase.from('phrases').select('*').order('difficulty_level')
      if (topicId) {
        query.eq('topic_id', topicId)
      }

      const { data, error } = await query

      if (error) {
        setError(error.message)
      } else {
        setPhrases(data ?? [])
      }
      setLoading(false)
    }

    fetchPhrases()
  }, [topicId])

  return { phrases, loading, error }
}
