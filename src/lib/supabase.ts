import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Phrase = {
  id: string
  topic_id: string
  russian_text: string
  academic_context: string
  audio_url: string | null
  difficulty_level: number
  created_at: string
}
