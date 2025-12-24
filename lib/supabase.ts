/**
 * Supabase Client Configuration
 *
 * Centralized Supabase client for both server and client components
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Get Supabase credentials from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_P_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_API || ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check .env.local')
}

/**
 * Client-side Supabase client
 * Safe to use in browser (uses anon key with RLS)
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

/**
 * Server-side Supabase client (for API routes, server components)
 * Uses service role key for admin operations (bypasses RLS)
 */
export function getServerSupabaseClient() {
  const serviceKey = process.env.SUPABASE_service_role || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceKey) {
    console.warn('No service role key found, using anon key')
    return supabase
  }

  return createClient<Database>(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Helper to get current user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

/**
 * Helper to check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}
