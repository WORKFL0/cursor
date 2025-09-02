import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/types/database'

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Create client only if configured
export const supabase = isSupabaseConfigured 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    })
  : null

// Create admin client for server-side operations (with service role key)
export const createAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey || !supabaseUrl) {
    console.warn('Supabase admin client not configured - missing service role key or URL')
    return null
  }
  
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Log configuration status
if (typeof window === 'undefined') {
  console.log('Supabase Configuration Status:', {
    configured: isSupabaseConfigured,
    url: supabaseUrl ? '✓ Set' : '✗ Missing',
    anonKey: supabaseAnonKey ? '✓ Set' : '✗ Missing',
    serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ Set' : '✗ Missing'
  })
}

// Re-export types from database types
export type {
  Article,
  ArticleInsert,
  ArticleUpdate,
  CMSUser,
  CMSUserInsert,
  CMSUserUpdate,
  ArticleCategory,
  ArticleTag,
  MediaFile,
  RSSFeed,
  RSSItem,
  LinkedInPost,
  AuditLog,
  UserSession,
  CMSSession,
  ArticleFilters,
  ArticleStats,
  ApiResponse,
  PaginatedResponse,
  UserRole,
  ArticleSource
} from '@/lib/types/database'