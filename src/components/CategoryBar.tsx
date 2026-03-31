'use client'

import { Calculator, FlaskConical, Atom } from 'lucide-react'

const CATEGORIES = [
  { id: 'all', label: 'Все', icon: null },
  { id: 'math', label: 'Математика', icon: Calculator },
  { id: 'physics', label: 'Физика', icon: Atom },
  { id: 'chemistry', label: 'Химия', icon: FlaskConical },
]

interface CategoryBarProps {
  selected: string
  onChange: (id: string) => void
}

export default function CategoryBar({ selected, onChange }: CategoryBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-95
            ${selected === id
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
        >
          {Icon && <Icon size={15} />}
          {label}
        </button>
      ))}
    </div>
  )
}
