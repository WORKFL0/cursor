import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

// Create a single supabase client for interacting with your database (only if configured)
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null

// Server-side client with service role key (for admin operations)
export const createSupabaseAdmin = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey || !supabaseUrl) {
    console.warn('Supabase admin client not configured - missing service role key or URL')
    return null
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Legacy export for backward compatibility
export const supabaseAdmin = createSupabaseAdmin()

// Database connection configuration for Payload CMS
export const getSupabaseConnectionString = (): string | null => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const password = process.env.SUPABASE_DB_PASSWORD
  
  if (!url || !password) {
    console.warn('Supabase connection string not available - missing URL or password')
    return null
  }
  
  try {
    // Extract the project reference from the Supabase URL
    const urlParts = url.split('//')
    if (!urlParts[1]) throw new Error('Invalid Supabase URL format')
    
    const hostParts = urlParts[1].split('.')
    if (!hostParts[0]) throw new Error('Invalid Supabase URL format')
    
    const projectRef = hostParts[0]
    
    // Return the PostgreSQL connection string for Payload CMS
    return `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`
  } catch (error) {
    console.error('Error parsing Supabase URL:', error)
    return null
  }
}

export default supabase