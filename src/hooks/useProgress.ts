'use client'

import { useState, useEffect, useCallback } from 'react'

const KEY = 'bertran_learned'

function load(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

function save(set: Set<string>) {
  localStorage.setItem(KEY, JSON.stringify(Array.from(set)))
}

export function useProgress() {
  const [learned, setLearned] = useState<Set<string>>(new Set())

  useEffect(() => {
    setLearned(load())
  }, [])

  const toggle = useCallback((id: string) => {
    setLearned(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      save(next)
      return next
    })
  }, [])

  const isLearned = useCallback((id: string) => learned.has(id), [learned])

  return { learned, toggle, isLearned }
}
