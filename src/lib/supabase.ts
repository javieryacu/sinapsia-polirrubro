import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = typeof window !== 'undefined'
    ? createBrowserClient<Database>(supabaseUrl, supabaseKey)
    : createClient<Database>(supabaseUrl, supabaseKey)
