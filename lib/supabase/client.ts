import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Create client only if configured
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    })
  : null

// Log configuration status
if (typeof window === 'undefined') {
  console.log('Supabase Configuration Status:', {
    configured: isSupabaseConfigured,
    url: supabaseUrl ? '✓ Set' : '✗ Missing',
    anonKey: supabaseAnonKey ? '✓ Set' : '✗ Missing'
  })
}

// Database types
export interface Article {
  id?: string
  title: string
  title_nl?: string
  slug: string
  excerpt?: string
  excerpt_nl?: string
  content?: string
  content_nl?: string
  author?: string
  category?: string
  tags?: string[]
  image?: string
  published?: boolean
  featured?: boolean
  source?: 'cms' | 'rss' | 'linkedin'
  external_url?: string
  published_at?: string
  created_at?: string
  updated_at?: string
}

export interface LinkedInPost {
  id?: string
  post_id: string
  author: string
  content: string
  url: string
  likes?: number
  comments?: number
  shares?: number
  published_at?: string
  imported_at?: string
  synced_to_articles?: boolean
}

export interface RSSItem {
  id?: string
  feed_url: string
  guid: string
  title: string
  description?: string
  link?: string
  pub_date?: string
  author?: string
  category?: string
  imported_at?: string
  synced_to_articles?: boolean
}