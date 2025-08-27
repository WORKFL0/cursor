import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Server-side client with service role key (for admin operations)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database connection configuration for Payload CMS
export const getSupabaseConnectionString = (): string => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const password = process.env.SUPABASE_DB_PASSWORD!
  
  // Extract the project reference from the Supabase URL
  const projectRef = url.split('//')[1].split('.')[0]
  
  // Return the PostgreSQL connection string for Payload CMS
  return `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`
}

export default supabase