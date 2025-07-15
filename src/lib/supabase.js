import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://project-id.supabase.co'
const SUPABASE_ANON_KEY = 'your-anon-key'

if (SUPABASE_URL === 'https://project-id.supabase.co' || SUPABASE_ANON_KEY === 'your-anon-key') {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})