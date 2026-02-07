
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

// Ensure we have the environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Check .env.local')
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || ''
)
